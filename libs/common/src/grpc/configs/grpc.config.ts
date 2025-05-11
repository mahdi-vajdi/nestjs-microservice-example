import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';

export interface GrpcConfig {
  url: string;
}

export const GRPC_CONFIG_TOKEN = 'grpc-config-token';

const grpcConfigSchema = Joi.object<GrpcConfig>({
  url: Joi.string().uri().required(),
});

export const grpcConfig = registerAs<GrpcConfig, ConfigFactory<GrpcConfig>>(
  GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = grpcConfigSchema.validate(
      {
        url: env.GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error) {
      throw new Error(`gRPC config validation error: ${error.message}`);
    }

    return value;
  },
);
