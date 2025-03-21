import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { GRPC_CHANNEL } from '@app/common/grpc';

export const CHANNEL_GRPC_CLIENT_PROVIDER = 'channel-grpc-client-provider';

export const channelGrpcOptions = () => {
  return ClientsModule.registerAsync([
    {
      name: CHANNEL_GRPC_CLIENT_PROVIDER,
      useFactory: async () => {
        if (!process.env.CHANNEL_GRPC_URL) {
          throw new Error('CHANNEL_GRPC_URL is empty.');
        }

        const grpcOptions = {
          package: [GRPC_CHANNEL],
          protoPath: [join(__dirname, '../../libs/common/grpc/proto/channel.proto')],
          url: process.env.CHANNEL_GRPC_URL,
        };

        const logger = new Logger('Channel gRPC Options');
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
