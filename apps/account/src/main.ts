import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_ACCOUNT } from '@app/common/dto-query';
import { join } from 'path';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get<LoggerService>(LOGGER_PROVIDER);

  app.useLogger(logger);
  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'account-listener',
      },
      consumerOptions: {
        deliverGroup: 'account-group',
        durable: 'account-durable',
        deliverTo: 'account-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'accountStream',
        subjects: ['account.>'],
      },
    }),
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_ACCOUNT,
      protoPath: join(__dirname, '../../../proto/account.proto'),
      url: configService.getOrThrow('ACCOUNT_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
