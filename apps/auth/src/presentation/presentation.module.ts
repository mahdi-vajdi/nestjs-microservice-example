import { Module } from '@nestjs/common';
import { AuthNatsController } from './nats/auth-nats.controller';
import { AuthGrpcController } from './grpc/auth-grpc.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthNatsController, AuthGrpcController],
})
export class PresentationModule {}
