import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LoggerService } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerModule } from '@app/common/logger/logger.module';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import {
  GRPC_CONFIG_TOKEN,
  grpcConfig,
  IGrpcConfig,
} from '@app/common/grpc/configs/grpc.config';
import { CHANNEL_GRPC_PACKAGE_NAME } from '@app/common/grpc/options/channel.options';

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
  const configService = await loadConfig();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: logger,
  });

  const grpcConfig = configService.get<IGrpcConfig>(GRPC_CONFIG_TOKEN);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: CHANNEL_GRPC_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        '../../../libs/common/src/grpc/proto/channel.proto',
      ),
      url: grpcConfig.url,
      loader: { keepCase: true },
    },
  });

  // app.connectMicroservice<CustomStrategy>({
  //   strategy: new NatsJetStreamServer({
  //     connectionOptions: {
  //       servers: configService.getOrThrow<string>('NATS_URI'),
  //       name: 'channel-listener',
  //     },
  //     consumerOptions: {
  //       deliverGroup: 'channel-group',
  //       durable: 'channel-durable',
  //       deliverTo: 'channel-messages',
  //       manualAck: true,
  //     },
  //     streamConfig: {
  //       name: 'channelStream',
  //       subjects: ['channel.>'],
  //     },
  //   }),
  // });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
