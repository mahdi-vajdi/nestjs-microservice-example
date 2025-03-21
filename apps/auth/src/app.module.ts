import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGrpcController } from './controllers/auth.grpc-controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, GrpcOptions } from '@nestjs/microservices';
import { GRPC_ACCOUNT, GRPC_AGENT } from 'libs/common/src/grpc';
import { JwtHelperService } from './services/jwt-helper.service';
import { AuthNatsController } from './controllers/auth.nats-controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ACCOUNT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/account.options';
import { AGENT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/agent.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
        AGENT_GRPC_URL: Joi.string().required(),
      }),
    }),
    LoggerModule,
    JwtModule.register({}),
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => ({
        connectionOptions: {
          servers: configService.getOrThrow<string>('NATS_URI'),
          name: 'auth-publisher',
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: GRPC_AGENT,
        useFactory: (configService: ConfigService) => {
          return configService.get<GrpcOptions>(AGENT_GRPC_CLIENT_PROVIDER);
        },
        inject: [ConfigService],
      },
      {
        name: GRPC_ACCOUNT,
        useFactory: (configService: ConfigService) => {
          return configService.get<GrpcOptions>(ACCOUNT_GRPC_CLIENT_PROVIDER);
        },
        inject: [ConfigService],
      },
    ]),
    ClientsModule.register([]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
