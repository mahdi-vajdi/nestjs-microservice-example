import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigService } from '@nestjs/config';
import { AGENT_WRITER } from './providers/agent.writer';
import { AgentNatsService } from './nats/agent-nats.service';
import { AUTH_WRITER } from './providers/auth.writer';
import { AuthNatsService } from './nats/auth-nats.service';
import { CHANNEL_WRITER } from './providers/channel.writer';
import { ChannelNatsService } from './nats/channel-nats.service';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => ({
        connectionOptions: {
          servers: configService.getOrThrow<string>('NATS_URI'),
          name: 'gateway-publisher',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: AGENT_WRITER,
      useClass: AgentNatsService,
    },
    {
      provide: AUTH_WRITER,
      useClass: AuthNatsService,
    },
    {
      provide: CHANNEL_WRITER,
      useClass: ChannelNatsService,
    },
  ],
  exports: [AGENT_WRITER, AUTH_WRITER, CHANNEL_WRITER],
})
export class CommandClientModule {}
