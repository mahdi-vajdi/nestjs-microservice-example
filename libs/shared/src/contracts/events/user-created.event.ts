export class UserCreatedIntegrationEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly role: string,
    public readonly occurredOn: Date,
  ) {}

  static readonly TOPIC = 'identity.UserCreatedEvent';
}
