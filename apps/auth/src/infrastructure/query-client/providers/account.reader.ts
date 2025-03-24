export interface IAccountReader {
  accountExists(email: string): Promise<boolean>;
}

export const ACCOUNT_READER = 'account-reader';
