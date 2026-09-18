export class UserLoggedInIntegrationEvent {
  static readonly TOPIC = 'auth.UserLoggedIn';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly occurredAt: Date,
  ) {}
}
