export interface VerifyRefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyRefreshTokenResponse {
  sub: string;
  email: string;
  account: string;
  role: string;
}
