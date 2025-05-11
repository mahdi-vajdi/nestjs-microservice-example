import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UserCreated implements StreamMessage {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Omit<UserCreated, 'streamKey'>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'user.user.created';
  }
}