import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  NATS_CONFIG_TOKEN,
  NatsConfig,
  natsConfig,
} from '@app/common/nats/nats.config';
import { UserNatsPublisher } from './nats/user-nats.publisher';
import { USER_EVENT_PUBLISHER } from '../../domain/event-publisher/user-event.publisher';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        const natsConfig = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);

        return {
          connectionOptions: {
            servers: natsConfig.server,
            name: 'user-publisher',
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(natsConfig)],
    }),
  ],
  providers: [
    {
      provide: USER_EVENT_PUBLISHER,
      useClass: UserNatsPublisher,
    },
  ],
  exports: [USER_EVENT_PUBLISHER],
})
export class EventPublisherModule {}
