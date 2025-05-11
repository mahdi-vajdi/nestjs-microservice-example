import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';

export interface UserGrpcConfig extends GrpcOptions {
}

export const USER_GRPC_CONFIG_TOKEN = 'user-grpc-config-token';
export const USER_GRPC_CLIENT_PROVIDER = 'user-grpc-client-provider';
export const USER_GRPC_PACKAGE_NAME = 'grpc_user';
export const USER_GRPC_SERVICE_NAME = 'UserService';

const userGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const userGrpcConfig = registerAs<UserGrpcConfig, ConfigFactory<UserGrpcConfig>>(
  USER_GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = userGrpcConfigSchema.validate(
      {
        url: env.USER_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );


    if (error) {
      throw new Error(`user-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: value.url,
        package: USER_GRPC_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/user.proto')],
        loader: { keepCase: true },
      },
    };
  },
);