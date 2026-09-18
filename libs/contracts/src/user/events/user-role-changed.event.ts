export class UserRoleChangedIntegrationEvent {
  static readonly TOPIC = 'user.RoleChanged';

  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly newRole: string,
    public readonly occurredAt: Date,
  ) {}
}
