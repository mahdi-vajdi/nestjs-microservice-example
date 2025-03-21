import { ChannelMessage } from '@app/common/grpc/models/channel/channel-message.dto';

export interface GetChannelByIdRequest {
  accountId: string;
  channelId: string;
}

export interface GetChannelByIdResponse extends ChannelMessage {
}
