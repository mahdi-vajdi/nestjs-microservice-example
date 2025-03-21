import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GRPC_ACCOUNT } from 'libs/common/src/grpc';
import { join } from 'path';
import {
  GRPC_CONFIG_TOKEN,
  grpcConfig,
  IGrpcConfig,
} from './presentation/grpc/config/grpc.config';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';

async function loadLogger(): Promise<LoggerService> {
  const appContext = await NestFactory.createApplicationContext(LoggerModule, {
    bufferLogs: true,
  });
  return appContext.get<WinstonLoggerService>(LOGGER_PROVIDER);
}

async function loadConfig(): Promise<ConfigService> {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [grpcConfig],
    }),
    {
      bufferLogs: true,
    },
  );

  return appContext.get<ConfigService>(ConfigService);
}

async function bootstrap() {
  const logger = await loadLogger();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  const configService = await loadConfig();

  const grpcConfig = configService.get<IGrpcConfig>(GRPC_CONFIG_TOKEN);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_ACCOUNT,
      protoPath: join(
        __dirname,
        '../../../libs/common/src/grpc/proto/account.proto',
      ),
      url: grpcConfig.url,
      loader: { keepCase: true },
    },
  });

  // app.connectMicroservice<CustomStrategy>({
  //   strategy: new NatsJetStreamServer({
  //     connectionOptions: {
  //       servers: configService.getOrThrow<string>('NATS_URI'),
  //       name: 'account-listener',
  //     },
  //     consumerOptions: {
  //       deliverGroup: 'account-group',
  //       durable: 'account-durable',
  //       deliverTo: 'account-messages',
  //       manualAck: true,
  //     },
  //     streamConfig: {
  //       name: 'accountStream',
  //       subjects: ['account.>'],
  //     },
  //   }),
  // });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
