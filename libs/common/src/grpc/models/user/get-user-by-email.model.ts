export interface GetUserByEmailRequest {
  userEmail: string;
}

export interface GetUserByEmailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
}
