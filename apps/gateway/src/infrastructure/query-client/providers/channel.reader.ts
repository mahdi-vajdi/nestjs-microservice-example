import { GetChannelByIdResponse } from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import { GetAccountChannelsResponse } from '@app/common/grpc/models/channel/get-account-channels-request.dto';

export interface IChannelReader {
  getChannelById(
    accountId: string,
    channelId: string,
  ): Promise<GetChannelByIdResponse>;

  getAccountChannels(accountId: string): Promise<GetAccountChannelsResponse>;
}

export const CHANNEL_READER = 'channel-reader';
