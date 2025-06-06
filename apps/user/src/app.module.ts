import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger/logger.module';
import { UserGrpcController } from './application/controllers/grpc/user-grpc.controller';
import { UserNatsController } from './application/controllers/nats/user-nats.controller';
import { commandHandlers } from './domain/commands';
import { queryHandlers } from './domain/queries';
import { eventHandlers } from './domain/events';
import { CqrsModule } from '@nestjs/cqrs';
import { ExternalEventPublisherModule } from './infrastructure/external-event-publisher/external-event-publisher.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    LoggerModule,
    CqrsModule,
    DatabaseModule,
    ExternalEventPublisherModule,
  ],
  providers: [...commandHandlers, ...queryHandlers, ...eventHandlers],
  controllers: [UserGrpcController, UserNatsController],
})
export class AppModule {}
