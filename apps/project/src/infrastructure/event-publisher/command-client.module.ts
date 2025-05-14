import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectNatsService } from './nats/project-nats.service';
import { PROJECT_EVENT_PUBLISHER } from '../../domain/events/project-event.publisher';
import {
  NATS_CONFIG_TOKEN,
  NatsConfig,
  natsConfig,
} from '@app/common/nats/nats.config';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);
        return {
          connectionOptions: {
            servers: config.server,
            name: 'project-publisher',
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(natsConfig)],
    }),
  ],
  providers: [
    {
      provide: PROJECT_EVENT_PUBLISHER,
      useClass: ProjectNatsService,
    },
  ],
  exports: [PROJECT_EVENT_PUBLISHER],
})
export class CommandClientModule {}
