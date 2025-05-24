import * as Joi from 'joi';
import { env } from 'node:process';
import { ConfigFactory, registerAs } from '@nestjs/config';

export interface HttpConfig {
  port: number;
}

export const HTTP_CONFIG_TOKEN = 'http-config-token';

const configValidation = Joi.object<HttpConfig, false>({
  port: env.HTTP_PORT,
});

export const httpConfig = registerAs<HttpConfig, ConfigFactory<HttpConfig>>(
  HTTP_CONFIG_TOKEN,
  () => {
    const { error, value } = configValidation.validate(
      {
        port: env.HTTP_PORT,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error)
      throw new Error(`error validating http config: ${error.message}`);

    return value;
  },
);
