import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_CONFIG_TOKEN,
  agentGrpcConfig,
  IAgentGrpcConfig,
} from '@app/common/grpc/configs/agent-grpc.config';
import {
  AUTH_GRPC_CLIENT_PROVIDER,
  AUTH_GRPC_CONFIG_TOKEN,
  authGrpcConfig,
  IAuthGrpcConfig,
} from '@app/common/grpc/configs/auth-grpc.config';
import {
  CHANNEL_GRPC_CLIENT_PROVIDER,
  CHANNEL_GRPC_CONFIG_TOKEN,
  channelGrpcConfig,
} from '@app/common/grpc/configs/channel-grpc.config';
import { AGENT_READER } from './providers/agent.reader';
import { AgentGrpcService } from './grpc/agent-grpc.service';
import { CHANNEL_READER } from './providers/channel.reader';
import { ChannelGrpcService } from './grpc/channel-grpc.service';
import { AUTH_READER } from './providers/auth.reader';
import { AuthGrpcService } from './grpc/auth-grpc.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AGENT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(AGENT_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(agentGrpcConfig)],
      },
      {
        name: AUTH_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAuthGrpcConfig>(AUTH_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(authGrpcConfig)],
      },
      {
        name: CHANNEL_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(CHANNEL_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(channelGrpcConfig)],
      },
    ]),
  ],
  providers: [
    {
      provide: AGENT_READER,
      useClass: AgentGrpcService,
    },
    {
      provide: CHANNEL_READER,
      useClass: ChannelGrpcService,
    },
    {
      provide: AUTH_READER,
      useClass: AuthGrpcService,
    },
  ],
  exports: [AGENT_READER, CHANNEL_READER, AUTH_READER],
})
export class QueryClientModule {}
