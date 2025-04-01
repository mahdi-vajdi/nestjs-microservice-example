export interface IUserReader {
  getAccountUserIds(accountId: string): Promise<string[]>;
}

export const USER_READER = 'user-reader';
