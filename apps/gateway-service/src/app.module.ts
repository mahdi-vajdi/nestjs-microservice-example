import {
  USER_GRPC_CLIENT,
  USER_PACKAGE,
  USER_PROTO_PATH,
  AUTH_GRPC_CLIENT,
  AUTH_PACKAGE,
  AUTH_PROTO_PATH,
} from '@app/contracts';
import { userGrpcConfig, authGrpcConfig, NatsJetStreamModule } from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserHttpController } from './controllers/http/user.http.controller';
import { AuthHttpController } from './controllers/http/auth.http.controller';
import { UserEventsNatsController } from './controllers/nats/user-events.nats.controller';
import { NotificationSseController } from './controllers/sse/notification.sse.controller';
import { SseService } from './services/sse.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [userGrpcConfig, authGrpcConfig],
    }),
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
  providers: [SseService],
})
export class AppModule {}
