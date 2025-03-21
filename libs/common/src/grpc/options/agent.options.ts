import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { GRPC_AGENT } from '@app/common/grpc';

export const AGENT_GRPC_CLIENT_PROVIDER = 'agent-grpc-client-provider';

export const agentGrpcOptions = () => {
  return ClientsModule.registerAsync([
    {
      name: AGENT_GRPC_CLIENT_PROVIDER,
      useFactory: async () => {
        if (!process.env.AGENT_GRPC_URL) {
          throw new Error('AGENT_GRPC_URL is empty.');
        }

        const grpcOptions = {
          package: [GRPC_AGENT],
          protoPath: [join(__dirname, '../proto/agent.proto')],
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
    },
  ]);
};
