import { DomainEvent } from '@app/common';

export class UserPasswordChangedEvent implements DomainEvent {
  public readonly eventName = 'UserPasswordChangedEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly newPasswordHash: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
  ) {}
}
