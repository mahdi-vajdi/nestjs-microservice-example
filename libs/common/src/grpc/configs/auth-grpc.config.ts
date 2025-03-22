import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';

export interface IAuthGrpcConfig extends GrpcOptions {
}

export const AUTH_GRPC_CONFIG_TOKEN = 'auth-grpc-config-token';
export const AUTH_GRPC_CLIENT_PROVIDER = 'auth-grpc-client-provider';
export const AUTH_GRPC_PACKAGE_NAME = 'grpc_auth';
export const AUTH_GRPC_SERVICE_NAME = 'AuthService';

const authGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const authGrpcConfig = registerAs<IAuthGrpcConfig, ConfigFactory<IAuthGrpcConfig>>(
  AUTH_GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = authGrpcConfigSchema.validate(
      {
        url: env.AUTH_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );


    if (error) {
      throw new Error(`auth-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: value.url,
        package: AUTH_GRPC_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/auth.proto')],
        loader: { keepCase: true },
      },
    };
  },
);