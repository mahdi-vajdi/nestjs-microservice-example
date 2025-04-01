import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IChannelWriter } from '../providers/channel.writer';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ClientProxy } from '@nestjs/microservices';
import * as uuid from 'uuid';
import { CreateChannel } from '@app/common/streams/channel/create-channel.model';
import { CreateChannelRequest } from '../models/channel/create-channel.model';
import { UpdateChannelUsers } from '@app/common/streams/channel/update-channel-users.model';
import { UpdateChannelUsersRequest } from '../models/channel/update-channel-users.model';

@Injectable()
export class ChannelNatsService
  extends BaseNatsJetstreamService
  implements IChannelWriter
{
  private readonly _logger = new Logger(ChannelNatsService.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {
    super();
  }

  get client(): ClientProxy<Record<never, Function>, string> {
    return this.natsClient;
  }

  get logger(): Logger {
    return this._logger;
  }

  get module(): string {
    return 'gateway-service';
  }

  async createChannel(req: CreateChannelRequest): Promise<void> {
    await this.emit(
      uuid.v4(),
      new CreateChannel({
        title: req.title,
        accountId: req.accountId,
        url: req.url,
        addAllUsers: req.addAllUsers,
      }),
    );
  }

  async updateChannelUsers(req: UpdateChannelUsersRequest): Promise<void> {
    await this.emit<UpdateChannelUsers>(
      uuid.v4(),
      new UpdateChannelUsers({
        users: req.users,
        channelId: req.channelId,
        requesterAccountId: req.requesterAccountId,
      }),
    );
  }
}
