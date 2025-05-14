import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  USER_GRPC_CONFIG_TOKEN,
  UserGrpcConfig,
  userGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
import {
  AUTH_GRPC_CONFIG_TOKEN,
  authGrpcConfig,
  AuthGrpcConfig,
} from '@app/common/grpc/configs/auth-grpc.config';
import { USER_QUERY_HANDLER } from '../../domain/query/interfaces/user-query.handler';
import { UserGrpcService } from './grpc/user-grpc.service';
import { AUTH_QUERY_HANDLER } from '../../domain/query/interfaces/auth-query.handler';
import { AuthGrpcService } from './grpc/auth-grpc.service';
import { GRPC_USER_PACKAGE_NAME } from '@app/common/grpc/models/user.proto';
import { GRPC_AUTH_PACKAGE_NAME } from '@app/common/grpc/models/auth.proto';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRPC_USER_PACKAGE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get<UserGrpcConfig>(USER_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(userGrpcConfig)],
      },
      {
        name: GRPC_AUTH_PACKAGE_NAME,
        useFactory: (configService: ConfigService) => {
          return configService.get<AuthGrpcConfig>(AUTH_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(authGrpcConfig)],
      },
    ]),
  ],
  providers: [
    {
      provide: USER_QUERY_HANDLER,
      useClass: UserGrpcService,
    },
    {
      provide: AUTH_QUERY_HANDLER,
      useClass: AuthGrpcService,
    },
  ],
  exports: [USER_QUERY_HANDLER, AUTH_QUERY_HANDLER],
})
export class QueryHandlerModule {}
