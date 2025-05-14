import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface WinstonLoggerConfig {
  useFile: boolean;
  filePath: string;
  level: string;
}

export const WINSTON_LOGGER_CONFIG_TOKEN = 'winston-logger-config-token';

const winstonLoggerConfigSchema = Joi.object<WinstonLoggerConfig>({
  useFile: Joi.boolean().default(false),
  filePath: Joi.string().required(),
  level: Joi.string()
    .valid('debug', 'verbose', 'log', 'warn', 'error')
    .required(),
});

export const winstonLoggerConfig = registerAs<
  WinstonLoggerConfig,
  ConfigFactory<WinstonLoggerConfig>
>(WINSTON_LOGGER_CONFIG_TOKEN, () => {
  const { error, value } = winstonLoggerConfigSchema.validate(
    {
      useFile: process.env.LOG_USE_FILE,
      filePath: process.env.LOG_FILE,
      level: process.env.LOG_LEVEL,
    },
    {
      allowUnknown: false,
      abortEarly: false,
    },
  );

  if (error) {
    throw new Error(
      `Winston logger config env validation error: ${error.message}`,
    );
  }

  return value;
});
