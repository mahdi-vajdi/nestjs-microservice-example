import { DomainEvent } from '@app/common';

import { UserRole } from '../types/user-role.enum';

export class UserCreatedEvent implements DomainEvent {
  public readonly eventName = 'UserCreatedEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly eventId: string,
    public readonly occurredAt: Date,
  ) {}
}
