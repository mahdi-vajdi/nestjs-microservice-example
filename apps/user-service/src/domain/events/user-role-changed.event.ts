import { DomainEvent } from '@app/common';

import { UserRole } from '../types/user-role.enum';

export class UserRoleChangedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserRoleChangedEvent';
  public readonly eventName = UserRoleChangedEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly role: UserRole,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
