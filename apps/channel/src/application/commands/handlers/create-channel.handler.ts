import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChannelCommand } from '../impl/create-channel.command';
import { Types } from 'mongoose';
import { Channel } from '../../../domain/entities/channel.entity';
import { Inject } from '@nestjs/common';
import {
  CHANNEL_DATABASE_PROVIDER,
  IChannelDatabaseProvider,
} from '../../../infrastructure/database/providers/channel.provider';

@CommandHandler(CreateChannelCommand)
export class CreateChannelHandler
  implements ICommandHandler<CreateChannelCommand, void>
{
  constructor(
    @Inject(CHANNEL_DATABASE_PROVIDER)
    private readonly databaseProvider: IChannelDatabaseProvider,
  ) {}

  async execute(command: CreateChannelCommand): Promise<void> {
    const channel = Channel.create(
      new Types.ObjectId().toHexString(),
      command.accountId,
      command.title,
      command.url,
      command.token,
      command.agents,
    );

    await this.databaseProvider.add(channel);
    channel.commit();
  }
}
