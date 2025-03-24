import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChannelByIdQuery } from '../impl/get-by-id.query';
import { ChannelModel } from '../../../infrastructure/database/mongo/models/channel.model';
import { Inject } from '@nestjs/common';
import {
  CHANNEL_DATABASE_PROVIDER,
  IChannelDatabaseProvider,
} from '../../../infrastructure/database/providers/channel.provider';

@QueryHandler(GetChannelByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetChannelByIdQuery> {
  constructor(
    @Inject(CHANNEL_DATABASE_PROVIDER)
    private readonly databaseProvider: IChannelDatabaseProvider,
  ) {}

  async execute(query: GetChannelByIdQuery): Promise<ChannelModel | null> {
    return await this.databaseProvider.findOneById(
      query.accountId,
      query.channelId,
    );
  }
}
