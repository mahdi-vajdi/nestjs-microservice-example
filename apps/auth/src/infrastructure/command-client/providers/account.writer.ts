import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '../models/account/create-account.model';

export interface IAccountWriter {
  createAccount(req: CreateAccountRequest): Promise<CreateAccountResponse>;
}

export const ACCOUNT_WRITER = 'account-writer';
