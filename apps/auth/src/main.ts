import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_AUTH } from 'libs/common/src/grpc';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerModule } from '@app/common/logger/logger.module';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule);
  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

async function bootstrap() {
  const logger = await loadLogger();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
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
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_AUTH,
      protoPath: join(__dirname, '../../../libs/common/grpc/proto/auth.proto'),
      url: configService.getOrThrow('AUTH_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
