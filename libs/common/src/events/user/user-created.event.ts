import { EventMessage } from '@app/common/events/event-message.model';

export class UserCreated implements EventMessage {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Omit<UserCreated, 'getKey'>) {
    Object.assign(this, UserCreated);
  }

  getKey(): string {
    return 'user.created';
  }
}