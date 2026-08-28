import { env } from 'node:process';

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const NatsConfigSchema = z.object({
  servers: z.array(z.string()).default(['nats://localhost:4222']),
  user: z.string().optional(),
  pass: z.string().optional(),
});

export const natsConfig = registerAs('nats', (): z.infer<typeof NatsConfigSchema> => {
  const servers = env.NATS_SERVERS?.split(',') || ['nats://localhost:4222'];

  const config = {
    servers,
    user: env.NATS_USER,
    pass: env.NATS_PASS,
  };

  return NatsConfigSchema.parse(config);
});

export const NATS_SERVICE_NAME = 'NATS_SERVICE';
