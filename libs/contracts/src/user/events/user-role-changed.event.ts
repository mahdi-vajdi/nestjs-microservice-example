export class UserRoleChangedIntegrationEvent {
  static readonly TOPIC = 'user.UserRoleChanged';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly newRole: string,
    public readonly occurredAt: Date,
    public readonly correlationId?: string,
  ) {}
}
