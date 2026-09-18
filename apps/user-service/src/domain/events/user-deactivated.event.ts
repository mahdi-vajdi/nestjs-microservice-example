import { DomainEvent } from '@app/common';

export class UserDeactivatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserDeactivatedEvent';
  public readonly eventName = UserDeactivatedEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
