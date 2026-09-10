import { userGrpcConfig } from '@app/infrastructure';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './interface/grpc/filters/rpc-exception.filter';

async function bootstrap() {
  const grpcConfig = userGrpcConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: grpcConfig.package,
      protoPath: grpcConfig.protoPath,
      url: `0.0.0.0:${grpcConfig.port}`,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  await app.listen();
  console.log(`User service is listening via gRPC on port ${grpcConfig.port}`);
}

bootstrap();
