import { Module } from '@nestjs/common';
import { USER_COMMAND_HANDLER } from '../../domain/command/interfaces/user-command.handler';
import { AUTH_COMMAND_HANDLER } from '../../domain/command/interfaces/auth-command.handler';
import { GRPC_USER_PACKAGE_NAME } from '@app/common/grpc/models/user.proto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  USER_GRPC_CONFIG_TOKEN,
  userGrpcConfig,
  UserGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
import {
  AUTH_GRPC_CONFIG_TOKEN,
  authGrpcConfig,
  AuthGrpcConfig,
} from '@app/common/grpc/configs/auth-grpc.config';
import { ClientsModule } from '@nestjs/microservices';
import { UserGrpcService } from './grpc/user-grpc.service';
import { AuthGrpcService } from './grpc/auth-grpc.service';
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
      provide: USER_COMMAND_HANDLER,
      useClass: UserGrpcService,
    },
    {
      provide: AUTH_COMMAND_HANDLER,
      useClass: AuthGrpcService,
    },
  ],
  exports: [USER_COMMAND_HANDLER, AUTH_COMMAND_HANDLER],
})
export class CommandHandlerModule {}
