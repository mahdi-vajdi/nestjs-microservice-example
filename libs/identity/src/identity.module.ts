import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/identity/infrastructure/persistance/entities/user.entity';
import { UserRepositoryPort } from '@app/identity/domain/src';
import { PostgresUserRepository } from '@app/identity/infrastructure/persistance/repositories/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from '@app/identity/application/commands/create-user/create-user.handler';
import { GetUserHandler } from '@app/identity/application/queries/get-user/get-user.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: PostgresUserRepository,
    },
    CreateUserHandler,
    GetUserHandler,
  ],
  exports: [UserRepositoryPort],
})
export class IdentityModule {}
