import { CreateUserRequest } from '../models/user/create-user.model';
import { UserDto } from '@app/common/dto-generic';

export interface UserWriter {
  createUser(req: CreateUserRequest): Promise<UserDto>;
}

export const USER_WRITER = 'user-writer';
