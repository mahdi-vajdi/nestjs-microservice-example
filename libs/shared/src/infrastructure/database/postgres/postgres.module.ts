import { env } from 'node:process';

import { postgresConfig } from '@app/shared/infrastructure/database/postgres/postgres.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(postgresConfig)],
      inject: [postgresConfig.KEY],
      useFactory: (config: ConfigType<typeof postgresConfig>) => ({
        type: 'postgres',
        port: config.port,
        host: config.host,
        username: config.username,
        password: config.password,
        database: config.database,
        synchronize: config.synchronize,
        autoLoadEntities: config.autoLoadEntities,
        ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
