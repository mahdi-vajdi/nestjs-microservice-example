import { User } from '../../entities/user.entity';
import { UpdateUserOptions } from './dtos/update-user.options';

export interface UserReader {
  getUserById(id: string): Promise<User>;

  getUserByEmail(email: string): Promise<User>;

  getUsersByAccountId(accountId: string): Promise<User[]>;

  getUsersIdsByAccountId(accountId: string): Promise<string[]>;

  userExists(email: string, phone: string): Promise<boolean>;
}

export interface UserWriter {
  createUser(entity: User): Promise<User>;

  updateUser(id: string, options: UpdateUserOptions): Promise<boolean>;
}

export interface UserRepository extends UserReader, UserWriter {}

export const USER_REPOSITORY = 'user-repository';
