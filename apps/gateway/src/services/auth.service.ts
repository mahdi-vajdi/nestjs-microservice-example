import { ApiResponse, AuthTokensDto } from '@app/common/dto-generic';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { Signup } from '@app/common/streams/auth/signup.model';
import { SignIn } from '@app/common/streams/auth/signin.model';
import { RefreshTokens } from '@app/common/streams/auth/refresh-tokens.model';
import { SignOut } from '@app/common/streams/auth/signout.model';
import { SigninDto } from '../dto/auth/signin.dto';
import { SignupDto } from '../dto/auth/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly natsClient: NatsJetStreamClientProxy) {}

  signup(dto: SignupDto, res: Response) {
    const request = new Signup(dto);
    return this.natsClient
      .send<
        ApiResponse<AuthTokensDto>,
        Signup
      >({ cmd: request.streamKey() }, request)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  signin(dto: SigninDto, res: Response) {
    const request = new SignIn(dto);
    return this.natsClient
      .send<
        ApiResponse<AuthTokensDto>,
        SigninDto
      >({ cmd: request.streamKey() }, request)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  signout(jwtPayload: JwtPayloadDto, res: Response) {
    const request = new SignOut({
      agentId: jwtPayload.sub,
    });
    this.natsClient.emit<ApiResponse<null>, SignOut>(
      request.streamKey(),
      request,
    );
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  refreshTokens(
    refreshToken: string,
    jwtPaylaod: JwtPayloadDto,
    res: Response,
  ) {
    const request = new RefreshTokens({
      agentId: jwtPaylaod.sub,
      refreshToken,
    });
    return this.natsClient
      .send<
        ApiResponse<AuthTokensDto>,
        RefreshTokens
      >(request.streamKey(), request)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            this.setTokensToCookies(res, response.data);
            return response;
          } else if (response.success && !response.data) {
            throw new InternalServerErrorException(
              'Something went wrong issuing tokens. Please sign in again.',
            );
          } else if (!response.success) {
            return new HttpException(
              response.error?.message || 'Somthing Went Wrong',
              response.error?.code || 500,
            );
          }
        }),
      );
  }

  private setTokensToCookies(res: Response, tokens: AuthTokensDto) {
    res.cookie('access_token', tokens.accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
