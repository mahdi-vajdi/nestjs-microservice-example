import { DomainEvent } from '@app/common';

export class UserActivatedEvent implements DomainEvent {
  public readonly eventName = 'UserActivatedEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
  ) {}
}
