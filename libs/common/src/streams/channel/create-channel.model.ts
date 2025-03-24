import { StreamMessage } from '@app/common/nats/stream-message.model';

export class CreateChannel implements StreamMessage {
  accountId: string;
  title: string;
  url: string;
  addAllAgents: boolean;

  constructor(init?: Partial<CreateChannel>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'channel.create';
  }
}