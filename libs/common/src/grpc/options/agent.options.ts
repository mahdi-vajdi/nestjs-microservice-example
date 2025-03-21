import { Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

export const AGENT_GRPC_CLIENT_PROVIDER = 'agent-grpc-client-provider';
export const AGENT_GRPC_PACKAGE_NAME = 'grpc_agent';

export const agentGrpcOptions = () => ({
  name: AGENT_GRPC_CLIENT_PROVIDER,
  useFactory: async () => {
    if (!process.env.AGENT_GRPC_URL) {
      throw new Error('AGENT_GRPC_URL is empty.');
    }

    const grpcOptions = {
      package: [AGENT_GRPC_PACKAGE_NAME],
      protoPath: [join(__dirname, '../../libs/common/grpc/proto/agent.proto')],
      url: process.env.AGENT_GRPC_URL,
    };

    const logger = new Logger('Agent gRPC Options');
    logger.log(`Service name: ${grpcOptions.package}`);
    logger.log(`ProtoPath: ${grpcOptions.protoPath}`);
    logger.log(`URL: ${grpcOptions.url}`);

    return {
      transport: Transport.GRPC,
      options: grpcOptions,
    };
  },
});
