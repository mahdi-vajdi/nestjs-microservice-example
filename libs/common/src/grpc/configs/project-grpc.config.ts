import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';
import { GRPC_ACCOUNT_PACKAGE_NAME } from '@app/common/grpc/models/project';

export interface ProjectGrpcConfig extends GrpcOptions {
}

export const PROJECT_GRPC_CONFIG_TOKEN = 'project-grpc-config-token';


const projectGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const projectGrpcConfig = registerAs<ProjectGrpcConfig, ConfigFactory<ProjectGrpcConfig>>(
  PROJECT_GRPC_CONFIG_TOKEN,
  () => {
    const { error } = projectGrpcConfigSchema.validate(
      {
        url: env.PROJECT_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );

    if (error) {
      throw new Error(`project-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: env.PROJECT_GRPC_URL,
        package: GRPC_ACCOUNT_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/project.proto')],
        loader: { keepCase: true },
      },
    };
  },
);