import { StreamMessage } from '@app/common/nats/stream-message.model';

export class CreateOwnerUser implements StreamMessage {
  accountId: string;
  firstName: string;
  lastName: string;
  channelId: string;
  email: string;
  phone: string;
  password: string;

  constructor(init?: Partial<CreateOwnerUser>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'user.create.owner';
  }
}