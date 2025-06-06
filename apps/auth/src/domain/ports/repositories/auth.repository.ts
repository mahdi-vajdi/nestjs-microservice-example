import { RefreshToken } from '../../entities/refresh-token.entity';
import { Credential } from '../../entities/credential.entity';

export interface AuthReader {
  getRefreshToken(userId: string, identifier: string): Promise<RefreshToken>;

  getCredential(userId: string): Promise<Credential>;
}

export interface AuthWriter {
  createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;

  softDeleteRefreshToken(id: string): Promise<boolean>;

  restoreRefreshToken(id: string): Promise<boolean>;

  createCredential(credential: Credential): Promise<Credential>;
}

export interface AuthRepository extends AuthReader, AuthWriter {}

export const AUTH_REPOSITORY = 'auth-repository';
