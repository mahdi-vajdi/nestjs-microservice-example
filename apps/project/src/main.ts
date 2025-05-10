import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';
import {
  IProjectGrpcConfig,
  PROJECT_GRPC_CONFIG_TOKEN,
  projectGrpcConfig,
} from '@app/common/grpc/configs/project-grpc.config';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule, {
    bufferLogs: true,
  });
  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

async function loadConfig(): Promise<ConfigService> {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [projectGrpcConfig],
    }),
  );
  return appContext.get<ConfigService>(ConfigService);
}

async function bootstrap() {
  const logger = await loadLogger();
  const configService = await loadConfig();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  const grpcConfig = configService.get<IProjectGrpcConfig>(
    PROJECT_GRPC_CONFIG_TOKEN,
  );
  app.connectMicroservice<MicroserviceOptions>(grpcConfig);

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'project-listener',
      },
      consumerOptions: {
        deliverGroup: 'project-group',
        durable: 'project-durable',
        deliverTo: 'project-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'projectStream',
        subjects: ['project.>'],
      },
    }),
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
