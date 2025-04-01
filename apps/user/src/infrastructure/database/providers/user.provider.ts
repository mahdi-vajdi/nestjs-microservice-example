import { Types } from 'mongoose';
import { User } from '../../../domain/entities/user.entity';
import { UserModel } from '../mongo/models/user.model';

export interface IUserReader {
  findById(id: string): Promise<User>;

  findByEmail(email: string): Promise<UserModel | null>;

  findByAccount(accountId: string): Promise<UserModel[]>;

  findIdsByAccount(accountId: string): Promise<string[]>;

  userExists(
    email: string,
    phone: string,
  ): Promise<{
    _id: Types.ObjectId;
  } | null>;
}

export interface IUsertWriter {
  add(entity: User): Promise<void>;

  save(entity: User): Promise<void>;
}

export interface IUserProvider extends IUserReader, IUsertWriter {}

export const USER_PROVIDER = 'user-provider';
