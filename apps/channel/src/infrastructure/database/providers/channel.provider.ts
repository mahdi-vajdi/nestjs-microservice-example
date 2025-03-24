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
  add(entity: Channel): Promise<string>;

  save(entity: Channel): Promise<void>;

  findById(id: string): Promise<Channel | null>;
}

export interface IChannelDatabaseProvider
  extends IChannelReader,
    IChannelWriter {}

export const CHANNEL_DATABASE_PROVIDER = 'channel-database-provider';
