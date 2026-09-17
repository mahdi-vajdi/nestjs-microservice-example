import { natsConfig, ServerJetStream, userGrpcConfig } from '@app/infrastructure';
import type { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './interface/grpc/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const grpcConf = userGrpcConfig();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: grpcConf.package,
      protoPath: grpcConf.protoPath,
      url: `0.0.0.0:${grpcConf.port}`,
    },
  });

  const nConfig = app.get<ConfigType<typeof natsConfig>>(natsConfig.KEY);
  app.connectMicroservice({
    strategy: new ServerJetStream({
      connectionOptions: { servers: nConfig.servers, user: nConfig.user, pass: nConfig.pass },
      consumerOptions: {
        stream: nConfig.streamName,
        durable: nConfig.consumerDurableName,
        ackWaitMs: nConfig.ackWaitMs,
        maxDeliver: nConfig.maxDeliver,
      },
    }),
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`User service: gRPC on :${grpcConf.port}, HTTP on :${port}`);
}

bootstrap();
