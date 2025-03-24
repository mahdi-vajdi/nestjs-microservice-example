import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountChannelsQuery } from '../impl/get-account-cahnnels.query';
import { ChannelModel } from '../../../infrastructure/database/mongo/models/channel.model';
import {
  CHANNEL_DATABASE_PROVIDER,
  IChannelDatabaseProvider,
} from '../../../infrastructure/database/providers/channel.provider';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAccountChannelsQuery)
export class GetAccountChannelsHandler
  implements IQueryHandler<GetAccountChannelsQuery>
{
  constructor(
    @Inject(CHANNEL_DATABASE_PROVIDER)
    private readonly databaseProvider: IChannelDatabaseProvider,
  ) {}

  async execute(query: GetAccountChannelsQuery): Promise<ChannelModel[]> {
    return await this.databaseProvider.findByAccount(query.accountId);
  }
}
