export class UserPasswordChangedIntegrationEvent {
  static readonly TOPIC = 'user.UserPasswordChanged';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly newPasswordHash: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
