export interface SignoutRequest {
  userId: string;
  tokenIdentifier: string;
}

export interface SignoutResponse {
  signedOut: boolean;
}