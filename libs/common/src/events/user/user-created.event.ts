import { EventMessage } from '@app/common/nats/event.model';

export class UserCreated implements EventMessage {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: Date;

  constructor(init?: Omit<UserCreated, 'getKey'>) {
    Object.assign(this, init);
  }

  getKey(): string {
    return 'user.user.created';
  }
}