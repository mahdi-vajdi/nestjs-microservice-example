import { UserRole } from '@app/common';

export interface GetAccountUsersRequest {
  accountId: string;
}

export interface GetAccountUsersResponse {
  users: GetAccountUsersItem[];
}

export interface GetAccountUsersItem {
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
