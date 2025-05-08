import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IAuthReader } from '../providers/auth.reader';
import { IAuthGrpcService } from '@app/common/grpc/interfaces/auth.interface';
import {
  AUTH_GRPC_CLIENT_PROVIDER,
  AUTH_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/auth-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { VerifyAccessTokenResponse } from '@app/common/grpc/models/auth/auth-access.dto';
import { lastValueFrom } from 'rxjs';
import { VerifyRefreshTokenResponse } from '@app/common/grpc/models/auth/verify-refresh-token.model';

@Injectable()
export class AuthGrpcService implements OnModuleInit, IAuthReader {
  private authGrpcService: IAuthGrpcService;

  constructor(
    @Inject(AUTH_GRPC_CLIENT_PROVIDER) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService = this.client.getService<IAuthGrpcService>(
      AUTH_GRPC_SERVICE_NAME,
    );
  }

  async verifyAccessToken(token: string): Promise<VerifyAccessTokenResponse> {
    return lastValueFrom(
      await this.authGrpcService.verifyAccessToken({
        accessToken: token,
      }),
    );
  }

  async verifyRefreshToken(token: string): Promise<VerifyRefreshTokenResponse> {
    return lastValueFrom(
      await this.authGrpcService.verifyRefreshToken({
        refreshToken: token,
      }),
    );
  }
}
