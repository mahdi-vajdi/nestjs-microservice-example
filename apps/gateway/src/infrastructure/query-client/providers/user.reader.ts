import { GetUserUsersResponse } from '@app/common/grpc/models/user/get-account-users.model';

export interface IUserReader {
  getAccountUsers(accountId: string): Promise<GetUserUsersResponse>;
}

export const USER_READER = 'user-reader';
