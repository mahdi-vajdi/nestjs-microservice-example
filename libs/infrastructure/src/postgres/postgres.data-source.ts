import 'dotenv/config';

import { DataSource } from 'typeorm';

import { postgresConfigSchema } from './postgres.config';

const config = postgresConfigSchema.parse({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  log: process.env.POSTGRES_LOG,
  slowQueryThreshold: process.env.POSTGRES_SLOW_QUERY_THRESHOLD,
  ssl: process.env.POSTGRES_SSL,
  applicationName: process.env.POSTGRES_APPLICATION_NAME,
  poolSize: process.env.POSTGRES_POOL_SIZE,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  ssl: config.ssl ? { rejectUnauthorized: false } : false,
  extra: {
    max: config.poolSize,
    application_name: config.applicationName,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/**/*.js'],
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
});
