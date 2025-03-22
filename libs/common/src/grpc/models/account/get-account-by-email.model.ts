export interface GetAccountByEmailRequest {
  email: string;
}

export interface GetAccountByEmailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
}
