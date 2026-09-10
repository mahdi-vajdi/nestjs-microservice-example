export class UserRoleChangedIntegrationEvent {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly newRole: string,
    public readonly occurredAt: Date,
  ) {}

  static readonly TOPIC = 'user.RoleChanged';
}
