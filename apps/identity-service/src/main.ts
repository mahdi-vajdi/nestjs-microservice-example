import { env } from 'node:process';

import { identityGrpcConfig } from '@app/shared';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const grpcConfig = identityGrpcConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: grpcConfig.package,
      protoPath: grpcConfig.protoPath,
      url: `0.0.0.0:${grpcConfig.port}`,
    },
  });

  await app.listen();
  console.log(`Identity service is listening via gRPC on port ${env.IDENTITY_SERVICE_PORT}`);
}

bootstrap();
