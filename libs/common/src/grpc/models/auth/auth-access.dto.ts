export interface VerifyAccessTokenRequest {
  accessToken: string;
}

export interface VerifyAccessTokenResponse {
  sub: string;
  email: string;
  account: string;
  role: string;
}
