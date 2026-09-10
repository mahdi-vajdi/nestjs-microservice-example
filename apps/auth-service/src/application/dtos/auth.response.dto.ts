export class AuthResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
  ) {}
}
