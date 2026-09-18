import { DomainEvent } from '@app/common';

import { UserRole } from '../types/user-role.enum';

export class UserCreatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserCreatedEvent';
  public readonly eventName = UserCreatedEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly passwordHash: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
