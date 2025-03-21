import { Module } from '@nestjs/common';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { GRPC_AGENT, GRPC_AUTH, GRPC_CHANNEL } from 'libs/common/src/grpc';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';
import { ChannelHttpController } from './controllers/http/channel.controller';
import { AgentHttpController } from './controllers/http/agent.controller';
import { AuthHttpController } from './controllers/http/auth.controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AgentService } from './services/agent.service';
import { ChannelService } from './services/channel.service';
import { AuthService } from './services/auth.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AGENT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/agent.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        CHANNEL_GRPC_URL: Joi.string().required(),
        AGENT_GRPC_URL: Joi.string().required(),
      }),
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
        name: GRPC_AUTH,
        useFactory: (configService: ConfigService) => {
          return configService.get<GrpcOptions>(AGENT_GRPC_CLIENT_PROVIDER);
        },
        inject: [ConfigService],
      },
      {
        name: GRPC_CHANNEL,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_CHANNEL,
            protoPath: join(
              __dirname,
              '../../../libs/common/grpc/proto/channel.proto',
            ),
            url: configService.getOrThrow('CHANNEL_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_AGENT,
        useFactory: (configService: ConfigService) => {
          return configService.get<GrpcOptions>(AGENT_GRPC_CLIENT_PROVIDER);
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthHttpController, ChannelHttpController, AgentHttpController],
  providers: [AuthService, AgentService, ChannelService],
})
export class AppModule {}
