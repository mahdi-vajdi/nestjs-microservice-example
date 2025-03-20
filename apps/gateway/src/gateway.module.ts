import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_AGENT, GRPC_AUTH, GRPC_CHANNEL } from '@app/common/dto-query';
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
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_AUTH,
            protoPath: join(__dirname, '../../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_CHANNEL,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_CHANNEL,
            protoPath: join(__dirname, '../../../proto/channel.proto'),
            url: configService.getOrThrow('CHANNEL_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_AGENT,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_AGENT,
            protoPath: join(__dirname, '../../../proto/agent.proto'),
            url: configService.getOrThrow('AGENT_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthHttpController, ChannelHttpController, AgentHttpController],
  providers: [AuthService, AgentService, ChannelService],
})
export class GatewayModule {}
