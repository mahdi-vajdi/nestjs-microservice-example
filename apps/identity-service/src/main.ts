import { NestFactory } from '@nestjs/core';
import { IdentityServiceModule } from './identity-service.module';

async function bootstrap() {
  const app = await NestFactory.create(IdentityServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
