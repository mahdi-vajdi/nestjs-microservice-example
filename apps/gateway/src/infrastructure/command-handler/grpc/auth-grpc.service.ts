import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GRPC_AUTH_PACKAGE_NAME,
} from '@app/common/grpc/models/auth.proto';
import { AuthCommandHandler } from '../../../domain/command/interfaces/auth-command.handler';
import {
  RefreshTokenCommandRequest,
  RefreshTokensCommandResponse,
} from 'apps/gateway/src/domain/command/commands/auth/refresh-token.command';
import {
  SigninCommandRequest,
  SigninCommandResponse,
} from 'apps/gateway/src/domain/command/commands/auth/signin.command';
import { SignoutCommandRequest } from 'apps/gateway/src/domain/command/commands/auth/signout.command';
import {
  CreateCredentialCommandRequest,
  CreateCredentialCommandResponse,
} from '../../../domain/command/commands/auth/create-credential.command';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGrpcService implements OnModuleInit, AuthCommandHandler {
  private authGrpcService: AuthServiceClient;

  constructor(
    @Inject(GRPC_AUTH_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async createCredential(
    req: CreateCredentialCommandRequest,
  ): Promise<CreateCredentialCommandResponse> {
    const res = await lastValueFrom(
      this.authGrpcService.createCredential({
        userId: req.userId,
        password: req.password,
      }),
    );

    return {
      createdAt: new Date(res.createdAt),
    };
  }

  async signin(req: SigninCommandRequest): Promise<SigninCommandResponse> {
    const res = await lastValueFrom(
      this.authGrpcService.signin({
        userId: req.userId,
        password: req.password,
      }),
    );

    return {
      refreshToken: res.refreshToken,
      accessToken: res.accessToken,
    };
  }

  async signout(req: SignoutCommandRequest): Promise<void> {
    await lastValueFrom(
      this.authGrpcService.signout({
        userId: req.userId,
        tokenIdentifier: req.tokenIdentifier,
      }),
    );
  }

  async refreshTokens(
    req: RefreshTokenCommandRequest,
  ): Promise<RefreshTokensCommandResponse> {
    const res = await lastValueFrom(
      this.authGrpcService.refreshTokens({
        refreshToken: req.refreshToken,
        userId: req.userId,
      }),
    );

    return {
      refreshToken: res.refreshToken,
      accessToken: res.accessToken,
    };
  }
}
