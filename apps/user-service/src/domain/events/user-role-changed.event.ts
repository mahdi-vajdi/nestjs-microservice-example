import { DomainEvent } from '@app/common';
import { UserRole } from '../types/user-role.enum';

export class UserRoleChangedEvent implements DomainEvent {
  public readonly eventName = 'UserRoleChangedEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly role: UserRole,
    public readonly eventId: string,
    public readonly occurredAt: Date,
  ) {}
}
