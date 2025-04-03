import { User } from '../entities/user.entity';
import { UpdateUserQueryable } from './queryables/update-user.queryable';

export interface IUserReader {
  getUserById(id: string): Promise<User>;

  getUserByEmail(email: string): Promise<User>;

  getUsersByAccountId(accountId: string): Promise<User[]>;

  getUsersIdsByAccountId(accountId: string): Promise<string[]>;

  userExists(email: string, phone: string): Promise<boolean>;
}

export interface IUserWriter {
  createUser(entity: User): Promise<User>;

  updateUser(id: string, queryable: UpdateUserQueryable): Promise<boolean>;
}

export interface IUserProvider extends IUserReader, IUserWriter {}

export const USER_PROVIDER = 'user-provider';
