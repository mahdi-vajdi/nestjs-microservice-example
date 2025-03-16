import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AccountModule } from './account.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_ACCOUNT } from '@app/common/dto-query';
import { join } from 'path';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AccountModule, { bufferLogs: true });

  const configService = app.get(ConfigService);

  const logger = new Logger('test');

  logger.log('starting application');
  app.useLogger(logger);

  logger.log('starting application');

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
  logger.log('initialized application');

  await app.startAllMicroservices();

  logger.log('started application');
}

bootstrap();
