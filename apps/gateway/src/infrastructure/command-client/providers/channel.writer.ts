import { CreateChannelRequest } from '../models/channel/create-channel.model';
import { UpdateChannelAgentsRequest } from '../models/channel/update-channel-agents.model';

export interface IChannelWriter {
  createChannel(req: CreateChannelRequest): Promise<void>;

  updateChannelAgents(req: UpdateChannelAgentsRequest): Promise<void>;
}

export const CHANNEL_WRITER = 'channel-writer';
