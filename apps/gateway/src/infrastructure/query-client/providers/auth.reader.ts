import { VerifyAccessTokenResponse } from '@app/common/grpc/models/auth/auth-access.dto';
import { VerifyRefreshTokenResponse } from '@app/common/grpc/models/auth/verify-refresh-token.model';

export interface IAuthReader {
  verifyAccessToken(token: string): Promise<VerifyAccessTokenResponse>;

  verifyRefreshToken(token: string): Promise<VerifyRefreshTokenResponse>;
}

export const AUTH_READER = 'auth-reader';
