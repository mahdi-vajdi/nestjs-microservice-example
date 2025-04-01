import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  IUserGrpcConfig,
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_CONFIG_TOKEN,
  userGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_READER } from './providers/user.reader';
import { UserGrpcService } from './grpc/user-grpc.service';

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
    ]),
  ],
  providers: [
    {
      provide: USER_READER,
      useClass: UserGrpcService,
    },
  ],
  exports: [USER_READER],
})
export class QueryClientModule {}
