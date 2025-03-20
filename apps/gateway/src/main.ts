import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { LOGGER_PROVIDER } from '@app/common/logger/provider/logger.provider';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = app.get<LoggerService>(LOGGER_PROVIDER);

  app.useLogger(logger);
  app.use(cookieParser());
  app.setGlobalPrefix('dashboard');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.getOrThrow('HTTP_PORT'));
}

bootstrap();
