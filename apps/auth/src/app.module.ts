import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AuthNatsController } from './application/controllers/nats/auth-nats.controller';
import { AuthGrpcController } from './application/controllers/grpc/auth-grpc.controller';
import { commandHandlers } from './domain/commands';
import { queryHandlers } from './domain/queries';
import { authConfig } from './configs/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
      envFilePath: '.env',
      cache: true,
    }),
    CqrsModule,
    JwtModule.register({}),
    DatabaseModule,
    LoggerModule,
  ],
  providers: [...commandHandlers, ...queryHandlers],
  controllers: [AuthGrpcController, AuthNatsController],
})
export class AppModule {}
