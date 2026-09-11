import { authGrpcConfig, natsConfig } from '@app/infrastructure';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './interface/grpc/filters/rpc-exception.filter';

async function bootstrap() {
  const grpcConfig = authGrpcConfig(); // Assuming this is defined similar to identityGrpcConfig

  const app = await NestFactory.create(AppModule); // Create hybrid app if needed, or just microservices

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: grpcConfig.package,
      protoPath: grpcConfig.protoPath,
      url: `0.0.0.0:${grpcConfig.port}`,
    },
  });

  const natsConf = natsConfig();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: natsConf.servers,
    },
  });

  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(3001); // Dummy port for HTTP, or don't listen HTTP if not needed
  console.log(`Auth service is listening via gRPC on port ${grpcConfig.port}`);
}

bootstrap();
