import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigService } from '@nestjs/config';
import { AGENT_WRITER } from './providers/agent.writer';
import { AgentNatsService } from './nats/agent-nats.service';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          connectionOptions: {
            servers: configService.getOrThrow<string>('NATS_URI'),
            name: 'account-publisher',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: AGENT_WRITER,
      useClass: AgentNatsService,
    },
  ],
  exports: [AGENT_WRITER],
})
export class CommandClientModule {}
