import { StreamMessage } from '@app/common/nats/stream-message.model';

export class CreateOwnerAgent implements StreamMessage {
  accountId: string;
  firstName: string;
  lastName: string;
  channelId: string;
  email: string;
  phone: string;
  password: string;

  constructor(init?: Partial<CreateOwnerAgent>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'agent.create.owner';
  }
}