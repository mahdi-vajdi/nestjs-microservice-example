export class ChangePasswordCommand {
  constructor(
    public readonly userId: string,
    public readonly newPasswordHash: string,
  ) {}
}
