import { Controller } from '@nestjs/common';
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePasswordCredentialsCommand } from '../../../domain/commands/impl/create-password-credentials.command';
import { SigninCommand } from '../../../domain/commands/impl/signin.command';
import { SignoutCommand } from '../../../domain/commands/impl/signout.command';
import { RefreshTokensCommand } from '../../../domain/commands/impl/refresh-tokens.command';
import { VerifyRefreshTokenQuery } from '../../../domain/queries/impl/verify-refresh-token.query';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createCredential(
    req: CreateCredentialRequest,
  ): Promise<CreateCredentialResponse> {
    try {
      const res = await this.commandBus.execute(
        new CreatePasswordCredentialsCommand(req.userId, req.password),
      );

      return { createdAt: res.createdAt.toISOString() };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async signin(req: SigninRequest): Promise<SigninResponse> {
    try {
      const res = await this.commandBus.execute(
        new SigninCommand(req.userId, req.password),
      );

      return { refreshToken: res.refreshToken, accessToken: res.accessToken };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }

  async signout(req: SignoutRequest): Promise<SignoutResponse> {
    try {
      const res = await this.commandBus.execute(
        new SignoutCommand(req.userId, req.tokenIdentifier),
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
      const res = await this.commandBus.execute(
        new RefreshTokensCommand(req.userId, req.refreshToken),
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
      const res = await this.queryBus.execute(
        new VerifyRefreshTokenQuery(req.refreshToken),
      );

      return { verified: res };
    } catch (error) {
      throw new RpcException(Result.error(error));
    }
  }
}
