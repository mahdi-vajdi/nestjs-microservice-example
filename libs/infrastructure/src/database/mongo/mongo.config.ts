import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface MongoConfig {
  uri: string;
}

export const MONGO_CONFIG_TOKEN = 'mongo-config-token';

const mongoConfigValidator = Joi.object<MongoConfig>({
  uri: Joi.string().uri().required(),
});

export const mongoConfig = registerAs<MongoConfig, ConfigFactory<MongoConfig>>(MONGO_CONFIG_TOKEN, () => {
  const { error, value } = mongoConfigValidator.validate({
    uri: env.MONGO_URI,
  });

  if (error) {
    throw new Error(
      `Mongo config validation error: ${error.message}`,
    );
  }

  return value;
});