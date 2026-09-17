export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
