import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger/logger.module';
import { agentGrpcConfig } from '@app/common/grpc/configs/agent-grpc.config';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [agentGrpcConfig],
    }),
    LoggerModule,
    PresentationModule,
  ],
})
export class AppModule {}
