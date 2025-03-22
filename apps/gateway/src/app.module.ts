import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChannelHttpController } from './controllers/http/channel.controller';
import { AgentHttpController } from './controllers/http/agent.controller';
import { AuthHttpController } from './controllers/http/auth.controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AgentService } from './services/agent.service';
import { ChannelService } from './services/channel.service';
import { AuthService } from './services/auth.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ClientsModule } from '@nestjs/microservices';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [agentGrpcConfig, authGrpcConfig, channelGrpcConfig],
    }),
    LoggerModule,
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => ({
        connectionOptions: {
          servers: configService.getOrThrow<string>('NATS_URI'),
          name: 'gateway-publisher',
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AGENT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(AGENT_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
      },
      {
        name: AUTH_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAuthGrpcConfig>(AUTH_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
      },
      {
        name: CHANNEL_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(CHANNEL_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthHttpController, ChannelHttpController, AgentHttpController],
  providers: [AuthService, AgentService, ChannelService],
})
export class AppModule {}
