import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  NATS_CONFIG_TOKEN,
  NatsConfig,
  natsConfig,
} from '@app/common/nats/nats.config';
import { NatsEventPublisher } from './nats/nats-event.publisher';
import { EVENT_PUBLISHER } from '../../domain/event-publisher/event-publisher.interface';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        const natsConfig = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);

        return {
          connectionOptions: {
            servers: natsConfig.server,
            name: 'gateway-publisher',
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(natsConfig)],
    }),
  ],
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useClass: NatsEventPublisher,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class EventPublisherModule {}
