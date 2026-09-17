import {
  authGrpcConfig,
  natsConfig,
  NatsJetStreamModule,
  PostgresModule,
  RedisModule,
} from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginHandler } from './application/commands/login/login.handler';
import { LogoutHandler } from './application/commands/logout/logout.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token/refresh-token.handler';
import { SyncUserHandler } from './application/commands/sync-user/sync-user.handler';
import { ValidateTokenHandler } from './application/queries/validate-token/validate-token.handler';
import {
  PasswordVerifierPort,
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredentialRepositoryPort,
} from './domain';
import { TokenRedisRepository } from './infrastructure/cache/token-redis.repository';
import { BcryptPasswordVerifier } from './infrastructure/hashing/bcrypt-password-verifier';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxEntity } from './infrastructure/persistence/entities/outbox.entity';
import { UserCredentialEntity } from './infrastructure/persistence/entities/user-credential.entity';
import { UserCredentialPostgresRepository } from './infrastructure/persistence/repositories/user-credential-postgres.repository';
import { JwtTokenGenerator } from './infrastructure/token/jwt-token-generator';
import { AuthGrpcController } from './interface/grpc/auth-grpc.controller';
import { UserEventsNatsController } from './interface/nats/user-events.nats.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authGrpcConfig, natsConfig], // assuming authGrpcConfig exists
    }),
    ScheduleModule.forRoot(),
    PostgresModule,
    RedisModule,
    CqrsModule,
    TypeOrmModule.forFeature([OutboxEntity, UserCredentialEntity], 'postgres'),
    NatsJetStreamModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret'),
      }),
    }),
  ],
  controllers: [AuthGrpcController, UserEventsNatsController],
  providers: [
    OutboxProcessor,
    {
      provide: UserCredentialRepositoryPort,
      useClass: UserCredentialPostgresRepository,
    },
    {
      provide: TokenSessionRepositoryPort,
      useClass: TokenRedisRepository,
    },
    {
      provide: TokenGeneratorPort,
      useClass: JwtTokenGenerator,
    },
    {
      provide: PasswordVerifierPort,
      useClass: BcryptPasswordVerifier,
    },
    LoginHandler,
    LogoutHandler,
    RefreshTokenHandler,
    SyncUserHandler,
    ValidateTokenHandler,
  ],
})
export class AppModule {}
