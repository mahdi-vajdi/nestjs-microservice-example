import { DomainEvent } from '@app/common';

export class UserLoggedInEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserLoggedInEvent';
  public readonly eventName = UserLoggedInEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
