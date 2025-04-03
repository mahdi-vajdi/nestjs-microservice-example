import * as Joi from 'joi';
import { ConfigFactory, registerAs } from '@nestjs/config';
import { env } from 'node:process';

export interface IMongoConfig {
  uri: string;
}

export const MONGO_CONFIG_TOKEN = 'mongo-config-token';

const mongoConfigSchema = Joi.object<IMongoConfig>({
  uri: Joi.string().uri().required(),
});

export const mongoConfig = registerAs<IMongoConfig, ConfigFactory<IMongoConfig>>(MONGO_CONFIG_TOKEN, () => {
  const { error, value } = mongoConfigSchema.validate({
    uri: env.MONGO_URI,
  });
  
  if (error) {
    throw new Error(
      `Mongo config env validation error: ${error.message}`,
    );
  }

  return value;
});