import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CustomStrategy, MicroserviceOptions } from '@nestjs/microservices';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';
import {
  ACCOUNT_GRPC_CONFIG_TOKEN,
  accountGrpcConfig,
  IAccountGrpcConfig,
} from '@app/common/grpc/configs/account-grpc.config';
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
      load: [accountGrpcConfig],
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

  const grpcConfig = configService.get<IAccountGrpcConfig>(
    ACCOUNT_GRPC_CONFIG_TOKEN,
  );
  app.connectMicroservice<MicroserviceOptions>(grpcConfig);

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

  // const natsConfig = configService.get<INatsConfig>(NATS_CONFIG_TOKEN);
  // const nats = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.NATS,
  //   options: {
  //     servers: [natsConfig.url], // Your NATS server address
  //     name: 'account-writer', // Optional client name
  //     jetstream: true, // Enable JetStream
  //     queue: 'commands_queue', // Optional queue group for load balancing
  //     streamConfig: {
  //       name: 'accountStream', // Stream name
  //       subjects: ['account.>'], // Subjects to capture in this stream
  //       storage: 'file', // 'file' or 'memory'
  //       retention: 'limits', // Retention policy
  //       maxConsumers: -1, // Max number of consumers
  //       maxMsgs: -1, // Max messages in the stream (-1 = unlimited)
  //       maxBytes: -1, // Max bytes in the stream (-1 = unlimited)
  //       discard: 'old', // Discard policy ('new' or 'old')
  //       maxAge: 86400000000000, // Max age of messages in nanoseconds (24 hours)
  //       replicas: 1, // Number of replicas
  //     },
  //     consumerOptions: {
  //       deliverGroup: 'account-service-group', // Consumer group
  //       durable: 'account-durable', // Durable name
  //       deliverTo: 'account-service-inbox', // Where to deliver messages
  //       ackPolicy: 'explicit', // Acknowledgment policy
  //       maxDeliver: 10, // Maximum redelivery attempts
  //       ackWait: 30000000000, // Acknowledgment wait in nanoseconds (30 seconds)
  //     },
  //   },
  // });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
