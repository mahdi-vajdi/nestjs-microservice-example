import { DomainEvent } from '@app/common';

export class UserCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
    public readonly role: string,
  ) {}
}
