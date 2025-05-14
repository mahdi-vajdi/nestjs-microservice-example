import { GetUserByIdQueryResponse } from '../queries/user/get-user-by-id.query';
import { GetUserByEmailQueryResponse } from '../queries/user/get-user-by-email.query';

export interface UserQueryHandler {
  getUserById(id: string): Promise<GetUserByIdQueryResponse>;

  getUserByEmail(email: string): Promise<GetUserByEmailQueryResponse>;
}

export const USER_QUERY_HANDLER = 'user-query-handler';
