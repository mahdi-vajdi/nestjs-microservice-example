import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  ACCOUNT_GRPC_CLIENT_PROVIDER,
  ACCOUNT_GRPC_CONFIG_TOKEN,
  accountGrpcConfig,
  IAccountGrpcConfig,
} from '@app/common/grpc/configs/account-grpc.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  IUserGrpcConfig,
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_CONFIG_TOKEN,
  userGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
import { ACCOUNT_READER } from './providers/account.reader';
import { AccountGrpcService } from './grpc/account-grpc.service';
import { UserGrpcService } from './grpc/user-grpc.service';
import { USER_READER } from './providers/user.reader';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAccountGrpcConfig>(
            ACCOUNT_GRPC_CONFIG_TOKEN,
          );
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(accountGrpcConfig)],
      },
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
      provide: ACCOUNT_READER,
      useClass: AccountGrpcService,
    },
    {
      provide: USER_READER,
      useClass: UserGrpcService,
    },
  ],
  exports: [ACCOUNT_READER, USER_READER],
})
export class QueryClientModule {}
