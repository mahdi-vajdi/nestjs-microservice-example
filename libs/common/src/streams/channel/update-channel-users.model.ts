import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UpdateChannelUsers implements StreamMessage {
  requesterAccountId: string;
  channelId: string;
  users: string[];

  constructor(init?: Partial<UpdateChannelUsers>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'channel.update.users';
  }
}