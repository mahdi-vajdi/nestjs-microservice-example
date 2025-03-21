import { Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

export const CHANNEL_GRPC_CLIENT_PROVIDER = 'channel-grpc-client-provider';
export const CHANNEL_GRPC_PACKAGE_NAME = 'grpc_channel';


export const channelGrpcOptions = () => ({
  name: CHANNEL_GRPC_CLIENT_PROVIDER,
  useFactory: async () => {
    if (!process.env.CHANNEL_GRPC_URL) {
      throw new Error('CHANNEL_GRPC_URL is empty.');
    }

    const grpcOptions = {
      package: [CHANNEL_GRPC_PACKAGE_NAME],
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
});
