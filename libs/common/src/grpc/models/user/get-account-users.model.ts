export interface GetUserUsersRequest {
  accountId: string;
}

export interface GetUserUsersResponse {
  users: GetUserUsersItem[];
}

export interface GetUserUsersItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  role: string;
  password: string;
  refreshToken: string | null;
}
