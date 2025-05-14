export class RefreshTokenCommandRequest {
  refreshToken: string;
  userId: string;
}

export class RefreshTokensCommandResponse {
  accessToken: string;
  refreshToken: string;
}
