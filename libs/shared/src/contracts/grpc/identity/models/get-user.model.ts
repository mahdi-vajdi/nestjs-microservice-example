export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
