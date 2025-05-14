import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';
import * as Joi from 'joi';

export interface NatsConfig {
  server: string;
}

export const NATS_CONFIG_TOKEN = 'nats-config-token';

const natsConfigValidator = Joi.object<NatsConfig>({
  server: Joi.string().uri().required(),
});

export const natsConfig = registerAs<NatsConfig, ConfigFactory<NatsConfig>>(NATS_CONFIG_TOKEN, () => {
  const { value, error } = natsConfigValidator.validate({
    server: env.NATS_URI,
  }, {
    allowUnknown: false,
    abortEarly: false,
  });

  if (error) throw new Error(`error validating nats config: ${error.message}`);

  return value;
});