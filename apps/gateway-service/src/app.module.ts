import { identityGrpcConfig } from '@app/shared';
import { natsConfig } from '@app/shared/infrastructure/nats/nats.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserHttpController } from './controllers/http/user.http.controller';
import { IdentityEventsNatsController } from './controllers/nats/identity-events.nats.controller';
import { NotificationSseController } from './controllers/sse/notification.sse.controller';
import { SseService } from './services/sse.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [identityGrpcConfig, natsConfig],
    }),
    ClientsModule.registerAsync([
      {
        name: 'IDENTITY_SERVICE',
        inject: [identityGrpcConfig.KEY],
        useFactory: (config: ConfigType<typeof identityGrpcConfig>) => ({
          transport: Transport.GRPC,
          options: {
            package: config.package,
            protoPath: config.protoPath,
            url: config.url,
          },
        }),
      },
    ]),
  ],
  controllers: [
    // HTTP
    UserHttpController,
    // NATS
    IdentityEventsNatsController,
    // SSE
    NotificationSseController,
  ],
  providers: [SseService],
})
export class AppModule {}
