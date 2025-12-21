export class UserCreatedEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
    public readonly role: string,
  ) {}
}
