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
import { ClientsModule } from '@nestjs/microservices';

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
    ClientsModule.registerAsync([accountGrpcOptions, agentGrpcOptions]),
  ],
  controllers: [AuthNatsController, AuthGrpcController],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtModule],
})
export class AppModule {}
