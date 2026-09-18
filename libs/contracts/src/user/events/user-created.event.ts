export class UserCreatedIntegrationEvent {
  static readonly TOPIC = 'user.UserCreated';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly role: string,
    public readonly passwordHash: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
