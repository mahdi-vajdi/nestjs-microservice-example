import { env } from 'node:process';

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const PostgresConfigSchema = z.object({
  host: z.string(),
  port: z.coerce.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  synchronize: z.boolean().default(false),
  autoLoadEntities: z.boolean().default(true),
});

export const postgresConfig = registerAs('postgres', () => {
  const config = {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT || 5432,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
  };

  return PostgresConfigSchema.parse(config);
});
