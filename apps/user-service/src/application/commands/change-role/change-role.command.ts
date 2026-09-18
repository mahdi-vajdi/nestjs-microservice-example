import { UserRole } from '../../../domain';

export class ChangeRoleCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
  ) {}
}
