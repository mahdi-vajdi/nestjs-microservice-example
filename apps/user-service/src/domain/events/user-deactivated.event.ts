import { DomainEvent } from '@app/common';

export class UserDeactivatedEvent implements DomainEvent {
  public readonly eventName = 'UserDeactivatedEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
  ) {}
}
