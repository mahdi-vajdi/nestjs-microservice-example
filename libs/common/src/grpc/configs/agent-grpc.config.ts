import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';

export interface IAgentGrpcConfig extends GrpcOptions {
}

export const AGENT_GRPC_CONFIG_TOKEN = 'agent-grpc-config-token';
export const AGENT_GRPC_CLIENT_PROVIDER = 'agent-grpc-client-provider';
export const AGENT_GRPC_PACKAGE_NAME = 'grpc_agent';
export const AGENT_GRPC_SERVICE_NAME = 'AgentService';

const agentGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const agentGrpcConfig = registerAs<IAgentGrpcConfig, ConfigFactory<IAgentGrpcConfig>>(
  AGENT_GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = agentGrpcConfigSchema.validate(
      {
        url: env.AGENT_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );


    if (error) {
      throw new Error(`agent-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: value.url,
        package: AGENT_GRPC_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/agent.proto')],
        loader: { keepCase: true },
      },
    };
  },
);