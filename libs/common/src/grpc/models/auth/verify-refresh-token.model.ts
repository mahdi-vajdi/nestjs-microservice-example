export interface VerifyRefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyRefreshTokenResponse {
  verified: boolean;
}
