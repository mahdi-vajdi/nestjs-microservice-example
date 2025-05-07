export interface GetUserByIdRequest {
  userId: string;
}

export interface GetUserByIdResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
}
