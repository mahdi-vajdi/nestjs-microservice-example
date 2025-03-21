import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGrpcController } from './presentation/grpc/auth.grpc-controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtHelperService } from './services/jwt-helper.service';
import { AuthNatsController } from './controllers/auth.nats-controller';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LoggerModule } from '@app/common/logger/logger.module';
import { accountGrpcOptions } from '@app/common/grpc/options/account.options';
import { agentGrpcOptions } from '@app/common/grpc/options/agent.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [agentGrpcOptions, accountGrpcOptions],
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
    accountGrpcOptions(),
    agentGrpcOptions(),
    // ClientsModule.registerAsync([
    //   {
    //     name: GRPC_AGENT,
    //     useFactory: (configService: ConfigService) => {
    //       return configService.get<MicroserviceOptions>(
    //         AGENT_GRPC_CLIENT_PROVIDER,
    //       );
    //     },
    //     inject: [ConfigService],
    //   },
    //   {
    //     name: GRPC_ACCOUNT,
    //     useFactory: (configService: ConfigService) => {
    //       return configService.get<MicroserviceOptions>(
    //         ACCOUNT_GRPC_CLIENT_PROVIDER,
    //       );
    //     },
    //     inject: [ConfigService],
    //   },
    // ]),
    // ClientsModule.register([]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
