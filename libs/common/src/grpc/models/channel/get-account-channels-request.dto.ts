import { ChannelMessage } from '@app/common/grpc/models/channel/channel-message.dto';

export interface GetAccountChannelsRequest {
  accountId: string;
}

export interface GetAccountChannelsResponse {
  channels: ChannelMessage[] | undefined;
}

