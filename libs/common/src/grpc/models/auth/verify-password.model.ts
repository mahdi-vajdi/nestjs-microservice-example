export interface VerifyPasswordRequest {
  userId: string;
  password: string;
}

export interface VerifyPasswordResponse {
  verified: boolean;
}