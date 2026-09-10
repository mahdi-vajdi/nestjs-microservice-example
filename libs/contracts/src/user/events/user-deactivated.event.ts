export class UserDeactivatedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly occurredAt: Date,
  ) {}

  static readonly TOPIC = 'user.UserDeactivated';
}
