import { ConfigFactory, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { env } from 'node:process';
import { Transport } from '@nestjs/microservices';
import { GrpcOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { join } from 'node:path';

export interface IChannelGrpcConfig extends GrpcOptions {
}

export const CHANNEL_GRPC_CONFIG_TOKEN = 'channel-grpc-config-token';
export const CHANNEL_GRPC_CLIENT_PROVIDER = 'channel-grpc-client-provider';
export const CHANNEL_GRPC_PACKAGE_NAME = 'grpc_channel';
export const CHANNEL_GRPC_SERVICE_NAME = 'ChannelService';

const channelGrpcConfigSchema = Joi.object<{ url: string }>({
  url: Joi.string().uri().required(),
});

export const channelGrpcConfig = registerAs<IChannelGrpcConfig, ConfigFactory<IChannelGrpcConfig>>(
  CHANNEL_GRPC_CONFIG_TOKEN,
  () => {
    const { error, value } = channelGrpcConfigSchema.validate(
      {
        url: env.CHANNEL_GRPC_URL,
      },
      {
        allowUnknown: false,
        abortEarly: false,
      },
    );


    if (error) {
      throw new Error(`channel-service gRPC config validation error: ${error.message}`);
    }

    return {
      transport: Transport.GRPC,
      options: {
        url: value.url,
        package: CHANNEL_GRPC_PACKAGE_NAME,
        protoPath: [join(__dirname, '../../libs/common/grpc/proto/channel.proto')],
        loader: { keepCase: true },
      },
    };
  },
);