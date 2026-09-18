export class UserDeactivatedIntegrationEvent {
  static readonly TOPIC = 'user.UserDeactivated';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly occurredAt: Date,
  ) {}
}
