import { Controller } from '@nestjs/common';
import { JwtPayloadMessage } from '@app/common/grpc';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { JwtHelperService } from '../../services/jwt-helper.service';
import { JwtPayloadDto } from '../../dto/jwt-payload.dto';
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

@Controller()
export class AuthGrpcController implements IAuthGrpcService {
  constructor(private readonly jwtService: JwtHelperService) {}

  @GrpcMethod('AuthService', 'VerifyAccessToken')
  async verifyAccessToken(
    data: VerifyAccessTokenRequest,
  ): Promise<Observable<VerifyAccessTokenResponse>> {
    try {
      const payload = await this.jwtService.verifyAccessToken(data.accessToken);
      return of(this.toJwtPayloadMessage(payload));
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }

  @GrpcMethod('AuthService', 'VerifyRefreshToken')
  async verifyRefreshToken(
    data: VerifyRefreshTokenRequest,
  ): Promise<Observable<VerifyRefreshTokenResponse>> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(
        data.refreshToken,
      );
      return of(this.toJwtPayloadMessage(payload));
    } catch (error) {
      throw new RpcException({
        statusCode: 401,
        message: error.message,
      });
    }
  }

  private toJwtPayloadMessage(dto: JwtPayloadDto): JwtPayloadMessage {
    return {
      sub: dto.sub,
      account: dto.account,
      email: dto.email,
      role: dto.role.toString(),
    };
  }
}
