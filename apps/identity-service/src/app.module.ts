import { identityGrpcConfig, PostgresModule } from '@app/infrastructure';
import { NATS_SERVICE_NAME, natsConfig } from '@app/infrastructure';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { GetUserHandler } from './application/queries/get-user/get-user.handler';
import { UserRepositoryPort } from './domain';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { OutboxEntity } from './infrastructure/persistance/entities/outbox.entity';
import { UserEntity } from './infrastructure/persistance/entities/user.entity';
import { UserPostgresRepository } from './infrastructure/persistance/repositories/user-postgres.repository';
import { IdentityGrpcController } from './interface/grpc/identity-grpc.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [identityGrpcConfig, natsConfig],
    }),
    ScheduleModule.forRoot(),
    PostgresModule,
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
})
export class AppModule {}
