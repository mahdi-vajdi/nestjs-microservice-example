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

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule, {
    bufferLogs: true,
  });
  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

async function loadConfig(): Promise<ConfigService> {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [userGrpcConfig],
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

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
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
