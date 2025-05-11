import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { SigninDto } from '../../dto/auth/signin.dto';
import { SignupDto } from '../../dto/auth/signup.dto';
import {
  AUTH_WRITER,
  AuthWriter,
} from '../../infrastructure/command-client/providers/auth.writer';
import { VerifyAccessTokenResponse } from '@app/common/grpc/models/auth/auth-access.dto';
import { VerifyRefreshTokenResponse } from '@app/common/grpc/models/auth/verify-refresh-token.model';
import {
  AUTH_READER,
  AuthReader,
} from '../../infrastructure/query-client/providers/auth.reader';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_READER) private readonly authReader: AuthReader,
    @Inject(AUTH_WRITER) private readonly authWriter: AuthWriter,
  ) {}

  async signup(dto: SignupDto, response: Response) {
    const res = await this.authWriter.signup({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
    });

    if (!res.refreshToken || !res.accessToken) {
      throw new InternalServerErrorException(
        'Something went wrong issuing tokens. Please sign in again.',
      );
    }

    return response;
  }

  async signin(dto: SigninDto, response: Response) {
    const res = await this.authWriter.signin({
      email: dto.email,
      password: dto.password,
    });
    if (!res) {
      throw new InternalServerErrorException(
        'Something went wrong issuing tokens. Please sign in again.',
      );
    }

    return res;
  }

  async signout(jwtPayload: JwtPayloadDto, res: Response) {
    await this.authWriter.signout({
      userId: jwtPayload.sub,
    });
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  async refreshTokens(
    refreshToken: string,
    jwtPaylaod: JwtPayloadDto,
    response: Response,
  ) {
    const res = await this.authWriter.refreshTokens({
      refreshToken: refreshToken,
      userId: jwtPaylaod.sub,
    });

    if (!res) {
      throw new InternalServerErrorException(
        'Something went wrong issuing tokens. Please sign in again.',
      );
    }

    return response;
  }

  async verifyAccessToken(token: string): Promise<VerifyAccessTokenResponse> {
    return this.authReader.verifyAccessToken(token);
  }

  async verifyRefreshToken(token: string): Promise<VerifyRefreshTokenResponse> {
    return this.authReader.verifyRefreshToken(token);
  }
}
