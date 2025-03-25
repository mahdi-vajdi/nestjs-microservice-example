import { Module } from '@nestjs/common';
import { AccountNatsController } from './nats/account-nats.controller';
import { AccountGrpcController } from './grpc/account-grpc.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [AccountNatsController, AccountGrpcController],
})
export class PresentationModule {}
