import { natsConfig, ServerJetStream } from '@app/infrastructure';
import { ValidationPipe } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // JetStream Microservice
  const nConfig = app.get<ConfigType<typeof natsConfig>>(natsConfig.KEY);
  app.connectMicroservice({
    strategy: new ServerJetStream({
      connectionOptions: {
        servers: nConfig.servers,
        user: nConfig.user,
        pass: nConfig.pass,
      },
      consumerOptions: {
        stream: nConfig.streamName,
        durable: nConfig.consumerDurableName,
        ackWaitMs: nConfig.ackWaitMs,
        maxDeliver: nConfig.maxDeliver,
      },
    }),
  });
  await app.startAllMicroservices();

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Commerce Microservices Gateway')
    .setDescription('The API Gateway for the E-Commerce Microservices platform')
    .setVersion('1.0')
    .addTag('Users')
    .addServer('http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Start
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Gateway service is running on ${await app.getUrl()}`);
  console.log(`Swagger is available on ${await app.getUrl()}/docs`);
}

bootstrap();
