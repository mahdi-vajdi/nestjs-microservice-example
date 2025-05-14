import { Module } from '@nestjs/common';
import { ProjectNatsController } from './nats/project-nats.controller';
import { ProjectGrpcController } from './grpc/project-grpc.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [ProjectNatsController, ProjectGrpcController],
})
export class PresentationModule {}
