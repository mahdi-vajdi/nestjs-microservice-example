export interface RefreshTokensRequest {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  refreshToken: string;
  accessToken: string;
}