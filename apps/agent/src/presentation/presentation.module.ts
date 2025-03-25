import { Module } from '@nestjs/common';
import { AgentGrpcController } from './grpc/agent-grpc.controller';
import { AgentNatsController } from './nats/agent-nats.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [AgentGrpcController, AgentNatsController],
})
export class PresentationModule {}
