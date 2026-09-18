import { DomainEvent } from '@app/common';

export class UserLoggedInEvent implements DomainEvent {
  public readonly eventName = 'UserLoggedInEvent';

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
