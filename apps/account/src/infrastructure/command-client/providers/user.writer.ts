import { CreateOwnerUserRequest } from '../models/user/create-owner-user.model';
import { UserDto } from '@app/common/dto-generic';

export interface IUserWriter {
  createOwnerUser(req: CreateOwnerUserRequest): Promise<UserDto>;
}

export const USER_WRITER = 'user-writer';
