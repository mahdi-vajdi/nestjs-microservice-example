import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerModule } from '@app/common/logger/logger.module';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import {
  AUTH_GRPC_CONFIG_TOKEN,
  authGrpcConfig,
  AuthGrpcConfig,
} from '@app/common/grpc/configs/auth-grpc.config';
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
      load: [authGrpcConfig, natsConfig],
    }),
    {
      bufferLogs: true,
    },
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

  const grpcConfig = configService.get<AuthGrpcConfig>(AUTH_GRPC_CONFIG_TOKEN);
  app.connectMicroservice<MicroserviceOptions>(grpcConfig);

  const natsConfig = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);
  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: natsConfig.server,
        name: 'auth-listener',
      },
      consumerOptions: {
        deliverGroup: 'auth-group',
        durable: 'auth-durable',
        deliverTo: 'auth-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'authStream',
        subjects: ['auth.*'],
      },
    }),
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
