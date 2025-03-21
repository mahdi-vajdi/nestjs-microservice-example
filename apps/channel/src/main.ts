import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { GRPC_CHANNEL } from 'libs/common/src/grpc';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const logger = app.get<LoggerService>(LOGGER_PROVIDER);

  app.useLogger(logger);
  app.connectMicroservice<CustomStrategy>({
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.getOrThrow<string>('NATS_URI'),
        name: 'channel-listener',
      },
      consumerOptions: {
        deliverGroup: 'channel-group',
        durable: 'channel-durable',
        deliverTo: 'channel-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'channelStream',
        subjects: ['channel.>'],
      },
    }),
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_CHANNEL,
      protoPath: join(
        __dirname,
        '../../../libs/common/grpc/proto/channel.proto',
      ),
      url: configService.getOrThrow('CHANNEL_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
