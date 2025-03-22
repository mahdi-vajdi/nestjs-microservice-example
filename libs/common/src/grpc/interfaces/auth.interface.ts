import { Observable } from 'rxjs/internal/Observable';
import { VerifyAccessTokenRequest, VerifyAccessTokenResponse } from '@app/common/grpc/models/auth/auth-access.dto';
import { VerifyRefreshTokenRequest, VerifyRefreshTokenResponse } from '@app/common/grpc/models/auth/auth-refresh.dto';

export interface IAuthGrpcService {
  verifyAccessToken(
    req: VerifyAccessTokenRequest,
  ): Promise<Observable<VerifyAccessTokenResponse>>;

  verifyRefreshToken(
    req: VerifyRefreshTokenRequest,
  ): Promise<Observable<VerifyRefreshTokenResponse>>;
}
