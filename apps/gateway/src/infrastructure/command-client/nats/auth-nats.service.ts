import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IAuthWriter } from '../providers/auth.writer';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ClientProxy } from '@nestjs/microservices';
import { Signup } from '@app/common/streams/auth/signup.model';
import { ApiResponse, AuthTokensDto } from '@app/common/dto-generic';
import * as uuid from 'uuid';
import { SignupRequest, SignupResponse } from '../models/auth/signup.model';
import { SigninRequest, SigninResponse } from '../models/auth/signin.model';
import { SignIn } from '@app/common/streams/auth/signin.model';
import { SignoutRequest } from '../models/auth/signout.model';
import { SignOut } from '@app/common/streams/auth/signout.model';
import { RefreshTokens } from '@app/common/streams/auth/refresh-tokens.model';
import {
  RefreshTokenRequest,
  RefreshTokensResponse,
} from '../models/auth/refresh-token.model';

@Injectable()
export class AuthNatsService
  extends BaseNatsJetstreamService
  implements IAuthWriter
{
  private readonly _logger = new Logger(AuthNatsService.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {
    super();
  }

  get client(): ClientProxy<Record<never, Function>, string> {
    return this.natsClient;
  }

  get logger(): Logger {
    return this._logger;
  }

  get module(): string {
    return 'gateway-service';
  }

  async signup(req: SignupRequest): Promise<SignupResponse> {
    const res = await this.send<Signup, ApiResponse<AuthTokensDto>>(
      uuid.v4(),
      new Signup({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        phone: req.phone,
        password: req.password,
      }),
    );
    if (res.error) throw res.error;

    return {
      refreshToken: res.data.refreshToken,
      accessToken: res.data.accessToken,
    };
  }

  async signin(req: SigninRequest): Promise<SigninResponse> {
    const res = await this.send<SignIn, ApiResponse<AuthTokensDto>>(
      uuid.v4(),
      new SignIn({
        email: req.email,
        password: req.password,
      }),
    );
    if (res.error) throw res.error;

    return {
      refreshToken: res.data.refreshToken,
      accessToken: res.data.accessToken,
    };
  }

  async signout(req: SignoutRequest): Promise<void> {
    await this.emit<SignOut>(
      uuid.v4(),
      new SignOut({
        userId: req.userId,
      }),
    );
  }

  async refreshTokens(
    req: RefreshTokenRequest,
  ): Promise<RefreshTokensResponse> {
    const res = await this.send<RefreshTokens, ApiResponse<AuthTokensDto>>(
      uuid.v4(),
      new RefreshTokens({
        refreshToken: req.refreshToken,
        userId: req.userId,
      }),
    );
    if (res.error) throw res.error;

    return {
      refreshToken: res.data.refreshToken,
      accessToken: res.data.accessToken,
    };
  }
}
