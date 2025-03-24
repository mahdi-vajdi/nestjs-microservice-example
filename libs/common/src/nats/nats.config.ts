import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface INatsConfig {
  url: string;
}

export const NATS_CONFIG_TOKEN = 'nats-config-token';

// TODO: add validation schema for the config

export const natsConfig = registerAs<INatsConfig, ConfigFactory<INatsConfig>>(NATS_CONFIG_TOKEN, () => {
  return {
    url: env.NATS_URI,
  };
});