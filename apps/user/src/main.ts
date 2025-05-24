import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerModule } from '@app/common/logger/logger.module';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import {
  USER_GRPC_CONFIG_TOKEN,
  UserGrpcConfig,
  userGrpcConfig,
} from '@app/common/grpc/configs/user-grpc.config';
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
      load: [userGrpcConfig, natsConfig],
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

  const grpcConfig = configService.get<UserGrpcConfig>(USER_GRPC_CONFIG_TOKEN);
  app.connectMicroservice<MicroserviceOptions>(grpcConfig);

  const natsConfig = configService.get<NatsConfig>(NATS_CONFIG_TOKEN);
  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: natsConfig.server,
        name: 'user-listener',
      },
      consumerOptions: {
        deliverGroup: 'user-group',
        durable: 'user-durable',
        deliverTo: 'user-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'userStream',
        subjects: ['user.>'],
      },
    }),
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
