import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface IGrpcConfig {
  url: string;
}

export const GRPC_CONFIG_TOKEN = 'grpc-config-token';

const grpcConfigSchema = Joi.object<IGrpcConfig>({
  url: Joi.string().uri().required(),
});

export const grpcConfig = registerAs<IGrpcConfig, ConfigFactory<IGrpcConfig>>(
  GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = grpcConfigSchema.validate(
      {
        url: process.env.GRPC_URL,
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
