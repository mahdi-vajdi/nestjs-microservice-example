export class RefreshTokenRequest {
  refreshToken: string;
  agentId: string;
}

export class RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}
