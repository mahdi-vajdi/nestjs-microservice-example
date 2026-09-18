import { DomainEvent } from '@app/common';

export class UserActivatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserActivatedEvent';
  public readonly eventName = UserActivatedEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
