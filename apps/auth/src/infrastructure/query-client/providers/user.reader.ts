import { GetUserByEmailResponse } from '@app/common/grpc/models/user/get-user-by-email.model';

export interface IUserReader {
  getUserByEmail(email: string): Promise<GetUserByEmailResponse>;

  getUserById(id: string): Promise<GetUserByEmailResponse>;
}

export const USER_READER = 'user-reader';
