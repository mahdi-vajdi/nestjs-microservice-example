import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateChannelAgentsCommand } from '../impl/update-channel-agents';
import { Inject } from '@nestjs/common';
import {
  CHANNEL_DATABASE_PROVIDER,
  IChannelDatabaseProvider,
} from '../../../infrastructure/database/providers/channel.provider';

@CommandHandler(UpdateChannelAgentsCommand)
export class UpdateChannelAgentsHandler
  implements ICommandHandler<UpdateChannelAgentsCommand, void>
{
  constructor(
    @Inject(CHANNEL_DATABASE_PROVIDER)
    private readonly databaseProvider: IChannelDatabaseProvider,
  ) {}

  async execute(command: UpdateChannelAgentsCommand): Promise<void> {
    const channel = await this.databaseProvider.findById(command.channelId);

    if (!channel || channel.account !== command.accountId)
      throw new Error('There is no channel or the channld Id does not match');

    if (channel && channel.account === command.accountId)
      channel.updateAgents(command.agentIds);

    await this.databaseProvider.save(channel);
    channel.commit();
  }
}
