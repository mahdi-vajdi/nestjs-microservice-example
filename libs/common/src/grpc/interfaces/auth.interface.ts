import { Observable } from 'rxjs/internal/Observable';
import {
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
} from '@app/common/grpc/models/auth/verify-refresh-token.model';
import {
  CreateCredentialsRequest,
  CreateCredentialsResponse,
} from '@app/common/grpc/models/auth/create-credentials.model';
import { VerifyPasswordRequest, VerifyPasswordResponse } from '@app/common/grpc/models/auth/verify-password.model';
import { SignoutRequest, SignoutResponse } from '@app/common/grpc/models/auth/signout.model';
import { RefreshTokensRequest, RefreshTokensResponse } from '@app/common/grpc/models/auth/refresh-tokens.model';

export interface AuthGrpcService {
  createCredential(
    req: CreateCredentialsRequest,
  ): Promise<Observable<CreateCredentialsResponse>>;

  verifyPassword(
    req: VerifyPasswordRequest,
  ): Promise<Observable<VerifyPasswordResponse>>;

  signout(req: SignoutRequest): Promise<Observable<SignoutResponse>>;

  refreshTokens(
    req: RefreshTokensRequest,
  ): Promise<Observable<RefreshTokensResponse>>;

  verifyRefreshToken(
    req: VerifyRefreshTokenRequest,
  ): Promise<Observable<VerifyRefreshTokenResponse>>;
}
