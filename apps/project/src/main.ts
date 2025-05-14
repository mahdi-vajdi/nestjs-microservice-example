import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';
import {
  PROJECT_GRPC_CONFIG_TOKEN,
  ProjectGrpcConfig,
  projectGrpcConfig,
} from '@app/common/grpc/configs/project-grpc.config';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import {
  NATS_CONFIG_TOKEN,
  natsConfig,
  NatsConfig,
} from '@app/common/nats/nats.config';

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule, {
    bufferLogs: true,
  });
  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

async function loadConfig(): Promise<ConfigService> {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [projectGrpcConfig, natsConfig],
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

  const grpcConfig = configService.get<ProjectGrpcConfig>(
    PROJECT_GRPC_CONFIG_TOKEN,
  );
  app.connectMicroservice<MicroserviceOptions>(grpcConfig);

  const natsConfig = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);
  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: natsConfig.server,
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
