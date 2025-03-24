import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { ChannelNatsController } from './nats/channel-nats.controller';
import { ChannelGrpcController } from './grpc/channel.grpc-controller';

@Module({
  imports: [ApplicationModule],
  controllers: [ChannelNatsController, ChannelGrpcController],
})
export class PresentationModule {}
