import { Channel } from '../../../domain/entities/channel.entity';
import { ChannelModel } from '../mongo/models/channel.model';

export interface IChannelReader {
  findOneById(
    accountId: string,
    channelId: string,
  ): Promise<ChannelModel | null>;

  findByAccount(accountId: string): Promise<ChannelModel[]>;
}

export interface IChannelWriter {
  add(entity: Channel): Promise<ChannelModel>;

  save(entity: Channel): Promise<void>;

  findById(id: string): Promise<Channel | null>;
}

export interface IChannelProvider extends IChannelReader, IChannelWriter {}

export const CHANNEL_PROVIDER = 'channel-provider';
