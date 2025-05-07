export interface CreateUserRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: string;
}

export interface CreateUserResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}