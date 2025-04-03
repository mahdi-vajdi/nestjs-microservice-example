import { UserRole } from '@app/common';

export interface GetUserByIdRequest {
  userId: string;
}

export interface GetUserByIdResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  role: UserRole;
  password: string;
  refreshToken: string | null;
}
