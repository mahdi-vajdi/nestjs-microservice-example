import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { GRPC_ACCOUNT } from '@app/common/grpc';

export const ACCOUNT_GRPC_CLIENT_PROVIDER = 'account-grpc-client-provider';

export const accountGrpcOptions = () => {
  return ClientsModule.registerAsync([
    {
      name: ACCOUNT_GRPC_CLIENT_PROVIDER,
      useFactory: async () => {
        if (!process.env.ACCOUNT_GRPC_URL) {
          throw new Error('ACCOUNT_GRPC_URL is empty.');
        }

        const grpcOptions = {
          package: [GRPC_ACCOUNT],
          protoPath: [join(__dirname, '../proto/account.proto')],
          url: process.env.ACCOUNT_GRPC_URL,
        };

        const logger = new Logger('Account gRPC Options');
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
