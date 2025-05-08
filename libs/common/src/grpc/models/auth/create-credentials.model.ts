export interface CreateCredentialsRequest {
  userId: string;
  password: string;
}

export interface CreateCredentialsResponse {
  createdAt: string;
}