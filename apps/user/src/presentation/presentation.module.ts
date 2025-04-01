import { Module } from '@nestjs/common';
import { UserGrpcController } from './grpc/user-grpc.controller';
import { UserNatsController } from './nats/user-nats.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UserGrpcController, UserNatsController],
})
export class PresentationModule {}
