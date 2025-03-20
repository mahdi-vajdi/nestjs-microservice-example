import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  CustomStrategy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { GRPC_AGENT } from '@app/common/dto-query';
import { join } from 'path';
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
        name: 'agent-listener',
      },
      consumerOptions: {
        deliverGroup: 'agent-group',
        durable: 'agent-durable',
        deliverTo: 'agent-messages',
        manualAck: true,
      },
      streamConfig: {
        name: 'agentStream',
        subjects: ['agent.>'],
      },
    }),
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_AGENT,
      protoPath: join(__dirname, '../../../proto/agent.proto'),
      url: configService.getOrThrow('AGENT_GRPC_URL'),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
