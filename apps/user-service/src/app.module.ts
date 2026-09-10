import {
  userGrpcConfig,
  natsConfig,
  NatsJetStreamModule,
  PostgresModule,
} from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Handlers
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { ChangePasswordHandler } from './application/commands/change-password/change-password.handler';
import { ChangeRoleHandler } from './application/commands/change-role/change-role.handler';
import { DeactivateUserHandler } from './application/commands/deactivate-user/deactivate-user.handler';
import { ActivateUserHandler } from './application/commands/activate-user/activate-user.handler';
import { UpdateLastLoginHandler } from './application/commands/update-last-login/update-last-login.handler';

import { GetUserHandler } from './application/queries/get-user/get-user.handler';
import { GetUserByEmailHandler } from './application/queries/get-user-by-email/get-user-by-email.handler';

import { USER_REPOSITORY_PORT, PASSWORD_HASHER_PORT } from './domain';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxEntity } from './infrastructure/persistence/entities/outbox.entity';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { UserPostgresRepository } from './infrastructure/persistence/repositories/user-postgres.repository';
import { BcryptPasswordHasher } from './infrastructure/hashing/bcrypt-password-hasher';

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

const queryHandlers = [
  GetUserHandler,
  GetUserByEmailHandler,
];

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
      provide: USER_REPOSITORY_PORT,
      useClass: UserPostgresRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasher,
    },
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class AppModule {}
