import { GetAccountUsersResponse } from '@app/common/grpc/models/user/get-account-users.model';

export interface IUserReader {
  getAccountUsers(accountId: string): Promise<GetAccountUsersResponse>;
}

export const USER_READER = 'user-reader';
