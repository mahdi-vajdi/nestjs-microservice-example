import { Logger } from '@nestjs/common';
import { StreamMessage } from '@app/common/nats/stream-message.model';
import { ClientProxy } from '@nestjs/microservices';
import { EventMessage } from '@app/common/nats/event-message.model';
import { lastValueFrom } from 'rxjs';

export abstract class NatsJetstreamService {

  abstract get client(): ClientProxy

  abstract get logger(): Logger;

  abstract get module(): string


  async send<TInput extends StreamMessage, TResult>(correlationId: string, msg: TInput): Promise<TResult> {
    try {
      const payload = new EventMessage<TInput>({
        module: this.module,
        correlationId: correlationId,
        message: msg,
      });

      this.logger.verbose(
        `adding to ${msg.streamKey()} stream, payload: ${JSON.stringify(payload)}`,
      );
      return await lastValueFrom(this.client.send<TResult, EventMessage<TInput>>(msg.streamKey(), payload));
    } catch (error) {
      this.logger.error(`error adding to ${msg.streamKey()} stream, error: ${error}`);
      throw error;
    }
  }

  async emit<TInput extends StreamMessage>(correlationId: string, msg: TInput): Promise<void> {
    try {
      const payload = new EventMessage<TInput>({
        module: this.module,
        correlationId: correlationId,
        message: msg,
      });

      this.logger.verbose(
        `adding to ${msg.streamKey()} stream, payload: ${JSON.stringify(payload)}`,
      );
      return await lastValueFrom(this.client.emit<any, EventMessage<TInput>>(msg.streamKey(), payload));
    } catch (error) {
      this.logger.error(`error adding to ${msg.streamKey()} stream, error: ${error}`);
      throw error;
    }
  }
}