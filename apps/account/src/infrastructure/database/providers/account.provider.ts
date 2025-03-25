import { Account } from '../../../domain/entities/account.entity';
import { AccountModel } from '../mongo/models/account.model';

export interface IAccountReader {
  findOneById(id: string): Promise<AccountModel | null>;

  findOneByEmail(email: string): Promise<AccountModel | null>;
}

export interface IAccountWriter {
  add(account: Account): Promise<void>;

  save(account: Account): Promise<void>;
}

export interface IAccountProvider extends IAccountReader, IAccountWriter {}

export const ACCOUNT_PROVIDER = 'account-provider';
