import { Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';

export const AUTH_GRPC_CLIENT_PROVIDER = 'auth-grpc-client-provider';
export const AUTH_GRPC_PACKAGE_NAME = 'grpc_auth';

export const authGrpcOptions = () => ({
  name: AUTH_GRPC_CLIENT_PROVIDER,
  useFactory: async () => {
    if (!process.env.AUTH_GRPC_URL) {
      throw new Error('AUTH_GRPC_URL is empty.');
    }

    const grpcOptions = {
      package: [AUTH_GRPC_PACKAGE_NAME],
      protoPath: [join(__dirname, '../../libs/common/grpc/proto/auth.proto')],
      url: process.env.AUTH_GRPC_URL,
    };

    const logger = new Logger('Auth gRPC Options');
    logger.log(`Service name: ${grpcOptions.package}`);
    logger.log(`ProtoPath: ${grpcOptions.protoPath}`);
    logger.log(`URL: ${grpcOptions.url}`);

    return {
      transport: Transport.GRPC,
      options: grpcOptions,
    };
  },
});
