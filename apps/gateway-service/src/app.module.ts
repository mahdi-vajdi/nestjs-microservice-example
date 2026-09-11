import {
  AUTH_GRPC_CLIENT,
  AUTH_PACKAGE,
  AUTH_PROTO_PATH,
  USER_GRPC_CLIENT,
  USER_PACKAGE,
  USER_PROTO_PATH,
} from '@app/contracts';
import { authGrpcConfig, NatsJetStreamModule, userGrpcConfig } from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthHttpController } from './interface/http/auth.http.controller';
import { UserHttpController } from './interface/http/user.http.controller';
import { UserEventsNatsController } from './interface/nats/user-events.nats.controller';
import { NotificationSseController } from './interface/sse/notification.sse.controller';
import { SseService } from './services/sse.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [userGrpcConfig, authGrpcConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    NatsJetStreamModule,
    ClientsModule.registerAsync([
      {
        name: USER_GRPC_CLIENT,
        inject: [userGrpcConfig.KEY],
        useFactory: (config: ConfigType<typeof userGrpcConfig>) => ({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE,
            protoPath: USER_PROTO_PATH,
            url: `${config.host}:${config.port}`,
          },
        }),
      },
      {
        name: AUTH_GRPC_CLIENT,
        inject: [authGrpcConfig.KEY],
        useFactory: (config: ConfigType<typeof authGrpcConfig>) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE,
            protoPath: AUTH_PROTO_PATH,
            url: `${config.host}:${config.port}`,
          },
        }),
      },
    ]),
  ],
  controllers: [
    UserHttpController,
    AuthHttpController,
    UserEventsNatsController,
    NotificationSseController,
  ],
  providers: [
    SseService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
