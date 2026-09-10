import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import type { ConnectionOptions, Consumer, ConsumerMessages, JsMsg, NatsConnection } from 'nats';
import {
  AckPolicy,
  connect,
  DeliverPolicy,
  ErrorCode,
  JSONCodec,
  NatsError,
  ReplayPolicy,
} from 'nats';

import { JetStreamContext } from './jetstream.context';

export interface JetStreamServerOptions {
  connectionOptions: ConnectionOptions;
  consumerOptions: {
    stream: string;
    durable: string;
    /**
     * Server-side subject filter(s). Narrows which messages this consumer receives
     * within the stream. Defaults to all subjects in the stream.
     */
    filterSubjects?: string[];
    ackWaitMs?: number;
    maxDeliver?: number;
  };
}

export class ServerJetStream extends Server implements CustomTransportStrategy {
  private nc?: NatsConnection;
  private consumer?: Consumer;
  private messages?: ConsumerMessages;
  private isRunning = false;
  private readonly jc = JSONCodec<Record<string, unknown>>();

  constructor(private readonly options: JetStreamServerOptions) {
    super();
  }

  public unwrap<T>(): T {
    if (!this.nc) throw new Error('NATS connection is not yet established');
    return this.nc as unknown as T;
  }

  public on() {
    // Intentionally empty — required by CustomTransportStrategy
  }

  public async listen(callback: () => void): Promise<void> {
    this.nc = await connect(this.options.connectionOptions);

    const js = this.nc.jetstream();
    const jsm = await this.nc.jetstreamManager();

    const {
      stream,
      durable,
      filterSubjects,
      ackWaitMs = 10_000,
      maxDeliver = 5,
    } = this.options.consumerOptions;

    // Ensure the durable pull consumer exists on the server, creating it if absent.
    try {
      await jsm.consumers.info(stream, durable);
      this.logger.log(
        `JetStream durable consumer '${durable}' already exists on stream '${stream}'`,
      );
    } catch (err) {
      if (!(err instanceof NatsError) || err.code !== ErrorCode.JetStream404NoMessages) {
        throw err;
      }
      await jsm.consumers.add(stream, {
        durable_name: durable,
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        replay_policy: ReplayPolicy.Instant,
        ack_wait: ackWaitMs * 1_000_000,
        max_deliver: maxDeliver,
        ...(filterSubjects?.length ? { filter_subjects: filterSubjects } : {}),
      });
      this.logger.log(
        `JetStream durable consumer '${durable}' created on stream '${stream}'` +
          (filterSubjects?.length ? ` (subjects: ${filterSubjects.join(', ')})` : ''),
      );
    }

    this.consumer = await js.consumers.get(stream, durable);
    this.messages = await this.consumer.consume();
    this.isRunning = true;

    // Run the consume loop in the background
    void this.consumeLoop(this.messages);

    callback();
  }

  private async consumeLoop(messages: ConsumerMessages): Promise<void> {
    try {
      for await (const msg of messages) {
        if (!this.isRunning) break;
        this.handleMessage(msg).catch((err) => {
          this.logger.error(`Unhandled error processing message on subject '${msg.subject}'`, err);
          msg.nak(1_000); // 1 s backoff on fatal framework errors
        });
      }
    } catch (err) {
      if (this.isRunning) {
        this.logger.error('JetStream consume loop terminated unexpectedly', err);
      }
    }
  }

  private async handleMessage(msg: JsMsg): Promise<void> {
    const handler = this.getHandlerByPattern(msg.subject);

    if (!handler) {
      this.logger?.debug?.(`No handler for subject '${msg.subject}', acknowledging and skipping.`);
      msg.ack();
      return;
    }

    const payload = msg.data.length > 0 ? this.jc.decode(msg.data) : null;
    const context = new JetStreamContext([msg]);

    const response$ = this.transformToObservable(await handler(payload, context));

    this.send(response$, (packet) => {
      if (packet.err) {
        this.logger.error(`Error in handler for subject '${msg.subject}': ${packet.err}`);
      }
      // Ack/nak is the handler's responsibility via JetStreamContext.
    });
  }

  public async close(): Promise<void> {
    this.isRunning = false;

    if (this.messages) {
      this.logger.log('Closing JetStream consumer message iterator...');
      this.messages.close();
    }

    if (this.nc && !this.nc.isClosed()) {
      this.logger.log('Draining NATS connection...');
      try {
        await this.nc.drain();
      } catch (err) {
        this.logger.error('Error draining NATS connection', err);
      }
    }
  }
}
