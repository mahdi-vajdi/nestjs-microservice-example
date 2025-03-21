import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AGENT_GRPC_PACKAGE_NAME } from '@app/common/grpc/options/agent.options';

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
  console.log('grpc config: ');

  const grpcConfig = configService.get<IGrpcConfig>(GRPC_CONFIG_TOKEN);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AGENT_GRPC_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        '../../../libs/common/src/grpc/proto/agent.proto',
      ),
      url: grpcConfig.url,
      loader: { keepCase: true },
    },
  });

  // app.connectMicroservice<CustomStrategy>({
  //   strategy: new NatsJetStreamServer({
  //     connectionOptions: {
  //       servers: configService.getOrThrow<string>('NATS_URI'),
  //       name: 'agent-listener',
  //     },
  //     consumerOptions: {
  //       deliverGroup: 'agent-group',
  //       durable: 'agent-durable',
  //       deliverTo: 'agent-messages',
  //       manualAck: true,
  //     },
  //     streamConfig: {
  //       name: 'agentStream',
  //       subjects: ['agent.>'],
  //     },
  //   }),
  // });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
