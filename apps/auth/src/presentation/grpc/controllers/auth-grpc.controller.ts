import { Controller } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';
import { RpcException } from '@nestjs/microservices';
import { Result } from '@app/common/result';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CreateCredentialRequest,
  CreateCredentialResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  SigninRequest,
  SigninResponse,
  SignoutRequest,
  SignoutResponse,
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
} from '@app/common/grpc/models/auth.proto';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async createCredential(
    req: CreateCredentialRequest,
  ): Promise<CreateCredentialResponse> {
    try {
      const res = await this.authService.createPasswordCredential(
        req.userId,
        req.password,
      );

      return { createdAt: res.createdAt.toISOString() };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async signin(req: SigninRequest): Promise<SigninResponse> {
    try {
      const res = await this.authService.signin(req.userId, req.password);

      return { refreshToken: res.refreshToken, accessToken: res.accessToken };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async signout(req: SignoutRequest): Promise<SignoutResponse> {
    try {
      const res = await this.authService.signoutUser(
        req.userId,
        req.tokenIdentifier,
      );
      return { signedOut: res };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async refreshTokens(
    req: RefreshTokensRequest,
  ): Promise<RefreshTokensResponse> {
    try {
      const res = await this.authService.refreshTokens(
        req.userId,
        req.refreshToken,
      );

      return {
        refreshToken: res.refreshToken,
        accessToken: res.accessToken,
      };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async verifyRefreshToken(
    req: VerifyRefreshTokenRequest,
  ): Promise<VerifyRefreshTokenResponse> {
    try {
      const res = await this.authService.verifyRefreshToken(req.refreshToken);

      return { verified: res };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }
}
