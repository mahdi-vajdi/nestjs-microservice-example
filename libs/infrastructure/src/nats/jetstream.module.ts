import { Global, Inject, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { JetStreamClient, NatsConnection } from 'nats';
import { connect, ErrorCode, NatsError, RetentionPolicy, StorageType } from 'nats';

import { DeadLetterModule } from './dead-letter.module';
import { NATS_CONNECTION, NATS_JETSTREAM_CLIENT, natsConfig } from './nats.config';

@Global()
@Module({
  imports: [DeadLetterModule],
  providers: [
    {
      provide: NATS_CONNECTION,
      inject: [natsConfig.KEY],
      useFactory: async (config: ConfigType<typeof natsConfig>): Promise<NatsConnection> => {
        return await connect({
          servers: config.servers,
          user: config.user,
          pass: config.pass,
          tls: config.tls ? {} : undefined,
        });
      },
    },
    {
      provide: NATS_JETSTREAM_CLIENT,
      inject: [NATS_CONNECTION, natsConfig.KEY],
      useFactory: async (
        nc: NatsConnection,
        config: ConfigType<typeof natsConfig>,
      ): Promise<JetStreamClient> => {
        const logger = new Logger('NatsJetStreamModule');
        const jsm = await nc.jetstreamManager();

        const storage = config.storageType === 'memory' ? StorageType.Memory : StorageType.File;

        const retention =
          config.retentionPolicy === 'workqueue'
            ? RetentionPolicy.Workqueue
            : config.retentionPolicy === 'interest'
              ? RetentionPolicy.Interest
              : RetentionPolicy.Limits;

        try {
          await jsm.streams.info(config.streamName);
          // Stream exists — only subjects are mutable; storage and retention
          // are immutable after creation and must be omitted from the update.
          await jsm.streams.update(config.streamName, {
            subjects: config.streamSubjects,
          });
          logger.log(
            `JetStream stream '${config.streamName}' already exists and subjects were reconciled: ${config.streamSubjects.join(', ')}`,
          );
        } catch (err) {
          // Re-throw anything that is NOT a "stream not found" (404) API error.
          if (!(err instanceof NatsError) || err.code !== ErrorCode.JetStream404NoMessages) {
            throw err;
          }

          await jsm.streams.add({
            name: config.streamName,
            subjects: config.streamSubjects,
            storage,
            retention,
          });
          logger.log(
            `JetStream stream '${config.streamName}' created with subjects: ${config.streamSubjects.join(', ')}`,
          );
        }

        return nc.jetstream();
      },
    },
  ],
  exports: [NATS_CONNECTION, NATS_JETSTREAM_CLIENT],
})
export class NatsJetStreamModule implements OnModuleDestroy {
  private readonly logger = new Logger(NatsJetStreamModule.name);

  constructor(@Inject(NATS_CONNECTION) private readonly connection: NatsConnection) {}

  async onModuleDestroy(): Promise<void> {
    if (this.connection && !this.connection.isClosed()) {
      this.logger.log('Draining and closing NATS connection...');
      try {
        await this.connection.drain();
      } catch (err) {
        this.logger.error('Error while draining NATS connection', err);
      }
    }
  }
}
