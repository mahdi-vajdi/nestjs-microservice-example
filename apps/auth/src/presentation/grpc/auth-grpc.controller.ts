import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { JwtHelperService } from '../../application/services/jwt-helper.service';
import { IAuthGrpcService } from '@app/common/grpc/interfaces/auth.interface';
import {
  VerifyAccessTokenRequest,
  VerifyAccessTokenResponse,
} from '@app/common/grpc/models/auth/auth-access.dto';
import {
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
} from '@app/common/grpc/models/auth/auth-refresh.dto';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AUTH_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/auth-grpc.config';

@Controller()
export class AuthGrpcController implements IAuthGrpcService {
  constructor(private readonly jwtService: JwtHelperService) {}

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'VerifyAccessToken')
  async verifyAccessToken(
    data: VerifyAccessTokenRequest,
  ): Promise<Observable<VerifyAccessTokenResponse>> {
    try {
      const payload = await this.jwtService.verifyAccessToken(data.accessToken);
      return of({
        sub: payload.sub,
        account: payload.account,
        email: payload.email,
        role: payload.role.toString(),
      });
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }

  @GrpcMethod(AUTH_GRPC_SERVICE_NAME, 'VerifyRefreshToken')
  async verifyRefreshToken(
    data: VerifyRefreshTokenRequest,
  ): Promise<Observable<VerifyRefreshTokenResponse>> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(
        data.refreshToken,
      );
      return of({
        sub: payload.sub,
        account: payload.account,
        email: payload.email,
        role: payload.role.toString(),
      });
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }
}
