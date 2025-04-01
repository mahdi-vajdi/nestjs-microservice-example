export class RefreshTokenRequest {
  refreshToken: string;
  userId: string;
}

export class RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}
