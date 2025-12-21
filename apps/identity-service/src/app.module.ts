import { IdentityModule } from '@app/identity';
import { identityGrpcConfig, PostgresModule } from '@app/shared';
import { natsConfig } from '@app/shared/infrastructure/nats/nats.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [identityGrpcConfig, natsConfig],
    }),
    PostgresModule,
    IdentityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
