import { env } from 'node:process';

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().optional(),
});

export const redisConfig = registerAs('redis', (): z.infer<typeof RedisConfigSchema> => {
  const config = {
    host: env.REDIS_HOST ?? 'localhost',
    port: Number(env.REDIS_PORT ?? 6379),
    password: env.REDIS_PASSWORD,
  };
  return RedisConfigSchema.parse(config);
});
