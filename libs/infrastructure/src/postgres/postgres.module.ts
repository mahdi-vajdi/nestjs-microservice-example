import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { postgresConfig } from './postgres.config';
import { TypeOrmLoggerAdapter } from './typeorm-logger.adapter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(postgresConfig)],
      inject: [postgresConfig.KEY],
      useFactory: (config: ConfigType<typeof postgresConfig>) => ({
        name: 'postgres',
        type: 'postgres',
        port: config.port,
        host: config.host,
        username: config.username,
        password: config.password,
        database: config.database,
        synchronize: false,
        autoLoadEntities: true,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
        extra: {
          max: config.poolSize,
          application_name: config.applicationName,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10_000,
        },
        logging: config.log,
        logger: new TypeOrmLoggerAdapter(),
        maxQueryExecutionTime: config.slowQueryThreshold,
        migrations: ['dist/**/migrations/**/*.js'],
        migrationsRun: false,
        migrationsTableName: 'typeorm_migrations',
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
