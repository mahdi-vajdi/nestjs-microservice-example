import { UserRole } from '@app/common';

export interface GetUserByEmailRequest {
  userEmail: string;
}

export interface GetUserByEmailResponse {
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
