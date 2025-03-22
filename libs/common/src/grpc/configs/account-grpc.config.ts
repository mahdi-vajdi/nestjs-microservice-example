import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';

export interface IAccountGrpcConfig extends GrpcOptions {
}

export const ACCOUNT_GRPC_CONFIG_TOKEN = 'account-grpc-config-token';
export const ACCOUNT_GRPC_CLIENT_PROVIDER = 'account-grpc-client-provider';
export const ACCOUNT_GRPC_PACKAGE_NAME = 'grpc_account';
export const ACCOUNT_GRPC_SERVICE_NAME = 'AccountService';


const accountGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const accountGrpcConfig = registerAs<IAccountGrpcConfig, ConfigFactory<IAccountGrpcConfig>>(
  ACCOUNT_GRPC_CONFIG_TOKEN,
  () => {
    const { error } = accountGrpcConfigSchema.validate(
      {
        url: env.ACCOUNT_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error) {
      throw new Error(`account-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: env.ACCOUNT_GRPC_URL,
        package: ACCOUNT_GRPC_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/account.proto')],
        loader: { keepCase: true },
      },
    };
  },
);