import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { WinstonLoggerService } from '@app/common/logger/winston/winston-logger.service';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';
import { LoggerService } from '@nestjs/common';
import { LoggerModule } from '@app/common/logger/logger.module';
import {
  ACCOUNT_GRPC_CONFIG_TOKEN,
  accountGrpcConfig,
  IAccountGrpcConfig,
} from '@app/common/grpc/configs/account-grpc.config';

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
