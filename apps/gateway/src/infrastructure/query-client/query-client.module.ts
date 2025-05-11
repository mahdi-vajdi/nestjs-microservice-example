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
import { USER_READER } from './providers/user.reader';
import { UserGrpcService } from './grpc/user-grpc.service';
import { AUTH_READER } from './providers/auth.reader';
import { AuthGrpcService } from './grpc/auth-grpc.service';
import { GRPC_AUTH_PACKAGE_NAME } from '@app/common/grpc/models/auth';
import { GRPC_USER_PACKAGE_NAME } from '@app/common/grpc/models/user';

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
      provide: USER_READER,
      useClass: UserGrpcService,
    },
    {
      provide: AUTH_READER,
      useClass: AuthGrpcService,
    },
  ],
  exports: [USER_READER, AUTH_READER],
})
export class QueryClientModule {}
