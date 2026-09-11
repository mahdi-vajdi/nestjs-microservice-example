export interface ValidateTokenRequest {
  accessToken: string;
}

export interface ValidateTokenResponse {
  userId: string;
  role: string;
  isValid: boolean;
}
