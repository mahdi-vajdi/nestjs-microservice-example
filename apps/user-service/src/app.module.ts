import {
  natsConfig,
  NatsJetStreamModule,
  PostgresModule,
  userGrpcConfig,
} from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivateUserHandler } from './application/commands/activate-user/activate-user.handler';
import { ChangePasswordHandler } from './application/commands/change-password/change-password.handler';
import { ChangeRoleHandler } from './application/commands/change-role/change-role.handler';
// Handlers
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { DeactivateUserHandler } from './application/commands/deactivate-user/deactivate-user.handler';
import { UpdateLastLoginHandler } from './application/commands/update-last-login/update-last-login.handler';
import { GetUserHandler } from './application/queries/get-user/get-user.handler';
import { GetUserByEmailHandler } from './application/queries/get-user-by-email/get-user-by-email.handler';
import { PasswordHasherPort, UserRepositoryPort } from './domain';
import { BcryptPasswordHasher } from './infrastructure/hashing/bcrypt-password-hasher';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxEntity } from './infrastructure/persistence/entities/outbox.entity';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { UserPostgresRepository } from './infrastructure/persistence/repositories/user-postgres.repository';
import { UserGrpcController } from './interface/grpc/user-grpc.controller';
import { AuthEventsNatsController } from './interface/nats/auth-events.nats.controller';

const commandHandlers = [
  CreateUserHandler,
  ChangePasswordHandler,
  ChangeRoleHandler,
  DeactivateUserHandler,
  ActivateUserHandler,
  UpdateLastLoginHandler,
];

const queryHandlers = [GetUserHandler, GetUserByEmailHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [userGrpcConfig, natsConfig],
    }),
    ScheduleModule.forRoot(),
    PostgresModule,
    CqrsModule,
    TypeOrmModule.forFeature([OutboxEntity, UserEntity], 'postgres'),
    NatsJetStreamModule,
  ],
  controllers: [UserGrpcController, AuthEventsNatsController],
  providers: [
    OutboxProcessor,
    {
      provide: UserRepositoryPort,
      useClass: UserPostgresRepository,
    },
    {
      provide: PasswordHasherPort,
      useClass: BcryptPasswordHasher,
    },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class AppModule {}
