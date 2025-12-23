import { CreateUserHandler } from '@app/identity/application/commands/create-user/create-user.handler';
import { GetUserHandler } from '@app/identity/application/queries/get-user/get-user.handler';
import { UserRepositoryPort } from '@app/identity/domain';
import { OutboxProcessor } from '@app/identity/infrastructure/outbox/outbox.processor';
import { UserEntity } from '@app/identity/infrastructure/persistance/entities/user.entity';
import { UserPostgresRepository } from '@app/identity/infrastructure/persistance/repositories/user-postgres.repository';
import { IdentityGrpcController } from '@app/identity/interface/grpc/identity-grpc.controller';
import { OutboxEntity } from '@app/shared/infrastructure/database/postgres/outbox.entity';
import { NATS_SERVICE_NAME, natsConfig } from '@app/shared/infrastructure/nats/nats.config';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OutboxEntity, UserEntity]),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE_NAME,
        inject: [natsConfig.KEY],
        useFactory: (config: ConfigType<typeof natsConfig>) => ({
          transport: Transport.NATS,
          options: {
            servers: config.servers,
            user: config.user,
            pass: config.pass,
          },
        }),
      },
    ]),
  ],
  controllers: [IdentityGrpcController],
  providers: [
    OutboxProcessor,
    {
      provide: UserRepositoryPort,
      useClass: UserPostgresRepository,
    },
    // Command Handlers
    CreateUserHandler,
    // Query Handlers
    GetUserHandler,
  ],
  exports: [UserRepositoryPort],
})
export class IdentityModule {}
