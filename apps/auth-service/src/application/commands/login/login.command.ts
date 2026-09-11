export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly passwordHash: string, // Simplified for now since we're using passwords from UI as plain, wait, the service gets plain password
  ) {}
}
