import { IdentityModule } from '@app/identity';
import { identityGrpcConfig, PostgresModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [identityGrpcConfig],
    }),
    PostgresModule,
    IdentityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
