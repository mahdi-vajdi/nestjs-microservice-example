import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  IUserGrpcConfig,
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_CONFIG_TOKEN,
  userGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
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
import { USER_READER } from './providers/user.reader';
import { UserGrpcService } from './grpc/user-grpc.service';
import { CHANNEL_READER } from './providers/channel.reader';
import { ChannelGrpcService } from './grpc/channel-grpc.service';
import { AUTH_READER } from './providers/auth.reader';
import { AuthGrpcService } from './grpc/auth-grpc.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IUserGrpcConfig>(USER_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(userGrpcConfig)],
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
          return configService.get<IUserGrpcConfig>(CHANNEL_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(channelGrpcConfig)],
      },
    ]),
  ],
  providers: [
    {
      provide: USER_READER,
      useClass: UserGrpcService,
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
  exports: [USER_READER, CHANNEL_READER, AUTH_READER],
})
export class QueryClientModule {}
