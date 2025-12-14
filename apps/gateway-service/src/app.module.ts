import { identityGrpcConfig } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [identityGrpcConfig],
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
  controllers: [],
  providers: [],
})
export class AppModule {}
