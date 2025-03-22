import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGrpcController } from './presentation/grpc/auth.grpc-controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtHelperService } from './services/jwt-helper.service';
import { AuthNatsController } from './controllers/auth.nats-controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ClientsModule } from '@nestjs/microservices';
import {
  ACCOUNT_GRPC_CLIENT_PROVIDER,
  ACCOUNT_GRPC_CONFIG_TOKEN,
  accountGrpcConfig,
  IAccountGrpcConfig,
} from '@app/common/grpc/configs/account-grpc.config';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_CONFIG_TOKEN,
  agentGrpcConfig,
  IAgentGrpcConfig,
} from '@app/common/grpc/configs/agent-grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [agentGrpcConfig, accountGrpcConfig],
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
        name: ACCOUNT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAccountGrpcConfig>(
            ACCOUNT_GRPC_CONFIG_TOKEN,
          );
        },
        inject: [ConfigService],
      },
      {
        name: AGENT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(AGENT_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
