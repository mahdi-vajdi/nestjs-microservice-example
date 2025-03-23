import { StreamMessage } from '@app/common/nats/stream-message.model';

export class CreateChannelRequest implements StreamMessage {
  accountId: string;
  title: string;
  url: string;
  addAllAgents: boolean;

  constructor(init?: Partial<CreateChannelRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'channel.create';
  }
}