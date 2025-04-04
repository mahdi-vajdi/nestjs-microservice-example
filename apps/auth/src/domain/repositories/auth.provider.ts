import { RefreshToken } from '../entities/refresh-token.entity';

export interface IAuthReader {
  getRefreshToken(userId: string, identifier: string): Promise<RefreshToken>;
}

export interface IAuthWriter {
  createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;

  softDeleteRefreshToken(id: string): Promise<boolean>;

  restoreRefreshToken(id: string): Promise<boolean>;
}

export interface IAuthProvider extends IAuthReader, IAuthWriter {}

export const AUTH_PROVIDER = 'auth-provider';
