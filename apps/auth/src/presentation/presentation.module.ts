import { Module } from '@nestjs/common';
import { AuthNatsController } from './nats/controllers/auth-nats.controller';
import { AuthGrpcController } from './grpc/controllers/auth-grpc.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthNatsController, AuthGrpcController],
})
export class PresentationModule {}
