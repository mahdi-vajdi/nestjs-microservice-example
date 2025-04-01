import { StreamMessage } from '@app/common/nats/stream-message.model';
import { UserRole } from '@app/common/dto-generic';

export class CreateUser implements StreamMessage {
  accountId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  channelIds: string[];
  password: string;
  role: UserRole;

  constructor(init?: Partial<CreateUser>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'user.create';
  }
}