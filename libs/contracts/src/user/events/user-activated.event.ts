export class UserActivatedIntegrationEvent {
  static readonly TOPIC = 'user.UserActivated';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly occurredAt: Date,
  ) {}
}
