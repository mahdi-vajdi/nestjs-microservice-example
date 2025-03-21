export interface GetAccountByIdRequest {
  id: string;
}

export interface GetAccountByIdResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
}
