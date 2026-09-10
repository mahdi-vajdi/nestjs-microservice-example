import { env } from 'node:process';

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const NatsConfigSchema = z.object({
  servers: z.array(z.string()).default(['nats://localhost:4222']),
  user: z.string().optional(),
  pass: z.string().optional(),
  tls: z.boolean().optional(),
  streamName: z.string(),
  streamSubjects: z.array(z.string()),
  consumerDurableName: z.string(),
  ackWaitMs: z.number().default(30_000),
  maxDeliver: z.number().default(5),
  storageType: z.enum(['file', 'memory']).default('file'),
  retentionPolicy: z.enum(['limits', 'interest', 'workqueue']).default('limits'),
});

export const natsConfig = registerAs('nats', (): z.infer<typeof NatsConfigSchema> => {
  const servers = env.NATS_SERVERS?.split(',') ?? ['nats://localhost:4222'];

  const config = {
    servers,
    user: env.NATS_USER,
    pass: env.NATS_PASS,
    tls: env.NATS_TLS === 'true' ? true : undefined,
    streamName: env.NATS_STREAM_NAME,
    streamSubjects: env.NATS_STREAM_SUBJECTS?.split(','),
    consumerDurableName: env.NATS_CONSUMER_DURABLE_NAME,
    ackWaitMs: env.NATS_ACK_WAIT_MS ? Number(env.NATS_ACK_WAIT_MS) : undefined,
    maxDeliver: env.NATS_MAX_DELIVER ? Number(env.NATS_MAX_DELIVER) : undefined,
    storageType: env.NATS_STORAGE_TYPE,
    retentionPolicy: env.NATS_RETENTION_POLICY,
  };

  return NatsConfigSchema.parse(config);
});

export const NATS_CONNECTION = 'NATS_CONNECTION';
export const NATS_JETSTREAM_CLIENT = 'NATS_JETSTREAM_CLIENT';
