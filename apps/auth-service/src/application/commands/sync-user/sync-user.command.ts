export type SyncUserPayload =
  | { action: 'CREATE'; email: string; passwordHash: string; role: string }
  | { action: 'CHANGE_PASSWORD'; passwordHash: string }
  | { action: 'CHANGE_ROLE'; role: string }
  | { action: 'DEACTIVATE' }
  | { action: 'ACTIVATE' };

export class SyncUserCommand {
  constructor(
    public readonly userId: string,
    public readonly payload: SyncUserPayload,
  ) {}
}
