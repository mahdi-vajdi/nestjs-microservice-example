export class UserPasswordChangedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly newPasswordHash: string,
    public readonly occurredAt: Date,
  ) {}

  static readonly TOPIC = 'user.PasswordChanged';
}
