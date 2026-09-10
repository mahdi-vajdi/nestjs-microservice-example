export class UserActivatedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly occurredAt: Date,
  ) {}

  static readonly TOPIC = 'user.UserActivated';
}
