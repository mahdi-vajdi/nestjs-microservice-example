import { DomainEvent } from '@app/common';

export class UserPasswordChangedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'UserPasswordChangedEvent';
  public readonly eventName = UserPasswordChangedEvent.EVENT_NAME;

  constructor(
    public readonly aggregateId: string,
    public readonly newPasswordHash: string,
    public readonly eventId: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
