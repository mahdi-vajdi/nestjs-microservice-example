import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AuthGrpcService } from '@app/common/grpc/interfaces/auth.interface';
import {
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
} from '@app/common/grpc/models/auth/verify-refresh-token.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AUTH_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/auth-grpc.config';
import { AuthService } from '../../../application/services/auth.service';
import { Result } from '@app/common/result';
import {
  SignoutRequest,
  SignoutResponse,
} from '@app/common/grpc/models/auth/signout.model';
import {
  CreateCredentialsRequest,
  CreateCredentialsResponse,
} from '@app/common/grpc/models/auth/create-credentials.model';
import {
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '@app/common/grpc/models/auth/verify-password.model';
import {
  RefreshTokensRequest,
  RefreshTokensResponse,
} from '@app/common/grpc/models/auth/refresh-tokens.model';

@Controller()
export class AuthGrpcController implements AuthGrpcService {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'CreateCredential')
  async createCredential(
    req: CreateCredentialsRequest,
  ): Promise<Observable<CreateCredentialsResponse>> {
    try {
      const res = await this.authService.createPasswordCredential(
        req.userId,
        req.password,
      );

      return of({ createdAt: res.createdAt.toISOString() });
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'VerifyPassword')
  async verifyPassword(
    req: VerifyPasswordRequest,
  ): Promise<Observable<VerifyPasswordResponse>> {
    try {
      const res = await this.authService.verifyUserPassword(
        req.userId,
        req.password,
      );

      return of({ verified: res });
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'Signout')
  async signout(req: SignoutRequest): Promise<Observable<SignoutResponse>> {
    try {
      const res = await this.authService.signoutUser(
        req.userId,
        req.tokenIdentifier,
      );
      return of({ signedOut: res });
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'RefreshTokens')
  async refreshTokens(
    req: RefreshTokensRequest,
  ): Promise<Observable<RefreshTokensResponse>> {
    try {
      const res = await this.authService.refreshTokens(
        req.userId,
        req.refreshToken,
      );

      return of({
        refreshToken: res.refreshToken,
        accessToken: res.accessToken,
      });
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'VerifyRefreshToken')
  async verifyRefreshToken(
    req: VerifyRefreshTokenRequest,
  ): Promise<Observable<VerifyRefreshTokenResponse>> {
    try {
      const res = await this.authService.verifyRefreshToken(req.refreshToken);

      return of({ verified: res });
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }
}
