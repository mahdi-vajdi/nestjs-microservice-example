import { CreateChannelRequest } from '../models/channel/create-channel.model';
import { UpdateChannelUsersRequest } from '../models/channel/update-channel-users.model';

export interface IChannelWriter {
  createChannel(req: CreateChannelRequest): Promise<void>;

  updateChannelUsers(req: UpdateChannelUsersRequest): Promise<void>;
}

export const CHANNEL_WRITER = 'channel-writer';
