export class SyncUserCommand {
  constructor(
    public readonly action: 'CREATE' | 'CHANGE_PASSWORD' | 'CHANGE_ROLE' | 'DEACTIVATE' | 'ACTIVATE',
    public readonly userId: string,
    public readonly payload?: any,
  ) {}
}
