import { natsConfig } from '@app/shared/infrastructure/nats/nats.config';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const natsCfg = app.get<ConfigType<typeof natsConfig>>(natsConfig.KEY);
  if (!natsCfg) {
    throw new Error('NATS configuration is missing');
  }

  // NATS
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: natsCfg.servers,
      user: natsCfg.user,
      pass: natsCfg.pass,
      queue: 'gateway_projections_queue',
    },
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shopping Backend Gateway')
    .setDescription('The API Gateway for the Shopping Microservices')
    .setVersion('1.0')
    .addTag('Users')
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Start
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Gateway service is running on ${await app.getUrl()}`);
  console.log(`Swagger is available on ${await app.getUrl()}/docs`);
}

bootstrap();
