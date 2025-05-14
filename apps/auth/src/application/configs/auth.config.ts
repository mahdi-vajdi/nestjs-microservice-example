import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';

export interface AuthConfig {
  accessJWTSecret: string;
  refreshJWTSecret: string;
}

export const AUTH_CONFIG_TOKEN = ' auth-config-token';

const authConfigSchema = Joi.object<AuthConfig>({
  accessJWTSecret: Joi.string().required(),
  refreshJWTSecret: Joi.string().required(),
});

export const authConfig = registerAs<AuthConfig, ConfigFactory<AuthConfig>>(
  AUTH_CONFIG_TOKEN,
  () => {
    const { error, value } = authConfigSchema.validate(
      {
        accessJWTSecret: env.AUTH_ACCESS_JWT_SECRET,
        refreshJWTSecret: env.AUTH_REFRESH_JWT_SECRET,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error) {
      throw new Error(` auth config validation error: ${error.message}`);
    }

    return value;
  },
);
