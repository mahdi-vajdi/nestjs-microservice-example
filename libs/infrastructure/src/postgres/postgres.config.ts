import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const postgresConfigSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().min(1).max(65535).default(5432),
  username: z.string().min(1),
  password: z.string().default(''),
  database: z.string().min(1),
  log: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  slowQueryThreshold: z.coerce.number().default(1000),
  ssl: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  applicationName: z.string().default('nestjs-microservices'),
  poolSize: z.coerce.number().min(1).max(100).default(10),
});

export const postgresConfig = registerAs('postgres', () => {
  return postgresConfigSchema.parse({
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
});
