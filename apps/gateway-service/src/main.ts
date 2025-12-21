import { natsConfig } from '@app/shared/infrastructure/nats/nats.config';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const nats = app.get<ConfigType<typeof natsConfig>>(natsConfig.KEY);
  if (!nats) {
    throw new Error('NATS configuration is missing');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: nats.servers,
      user: nats.user,
      pass: nats.pass,
      queue: 'gateway_projections_queue',
    },
  });

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Gateway service is listening on port ${await app.getUrl()}`);
}

bootstrap();
