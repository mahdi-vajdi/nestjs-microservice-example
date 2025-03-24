import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IChannelGrpcService } from '@app/common/grpc/interfaces/channel.interface';
import {
  CHANNEL_GRPC_CLIENT_PROVIDER,
  CHANNEL_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/channel-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { GetChannelByIdResponse } from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import { lastValueFrom } from 'rxjs';
import { GetAccountChannelsResponse } from '@app/common/grpc/models/channel/get-account-channels-request.dto';
import { IChannelReader } from '../providers/channel.reader';

@Injectable()
export class ChannelGrpcService implements OnModuleInit, IChannelReader {
  private grpcService: IChannelGrpcService;

  constructor(
    @Inject(CHANNEL_GRPC_CLIENT_PROVIDER)
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcService = this.grpcClient.getService<IChannelGrpcService>(
      CHANNEL_GRPC_SERVICE_NAME,
    );
  }

  async getChannelById(
    accountId: string,
    channelId: string,
  ): Promise<GetChannelByIdResponse> {
    return lastValueFrom(
      await this.grpcService.getChannelById({
        accountId,
        channelId,
      }),
    );
  }

  async getAccountChannels(
    accountId: string,
  ): Promise<GetAccountChannelsResponse> {
    return lastValueFrom(
      await this.grpcService.getAccountChannels({
        accountId: accountId,
      }),
    );
  }
}
