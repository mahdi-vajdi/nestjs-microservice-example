import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenGuard } from '../../guards/refresh-token.guard';
import { SignupRequest, SignupResponse } from './models/signup.model';
import { SigninRequest, SigninResponse } from './models/signin.model';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { JwtPayloadDto } from './models/jwt-payload.dto';
import {
  AUTH_COMMAND_HANDLER,
  AuthCommandHandler,
} from '../../../../domain/command/interfaces/auth-command.handler';
import {
  USER_COMMAND_HANDLER,
  UserCommandHandler,
} from '../../../../domain/command/interfaces/user-command.handler';
import {
  USER_QUERY_HANDLER,
  UserQueryHandler,
} from '../../../../domain/query/interfaces/user-query.handler';
import { RefreshTokensResponse } from './models/refresh-tokens.model';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthHttpController {
  constructor(
    @Inject(AUTH_COMMAND_HANDLER)
    private readonly authCommandHandler: AuthCommandHandler,
    @Inject(USER_COMMAND_HANDLER)
    private readonly userCommandHandler: UserCommandHandler,
    @Inject(USER_QUERY_HANDLER)
    private readonly userQueryHandler: UserQueryHandler,
  ) {}

  @Post('signup')
  @ApiOkResponse({ type: SignupResponse })
  async signup(@Body() body: SignupRequest): Promise<SignupResponse> {
    const createUserRes = await this.userCommandHandler.createUser({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      avatar: body.avatar,
    });

    const savePasswordRes = await this.authCommandHandler.createCredential({
      userId: createUserRes.id,
      password: body.password,
    });

    const tokensRes = await this.authCommandHandler.signin({
      userId: createUserRes.id,
      password: body.password,
    });

    return {
      accessToken: tokensRes.accessToken,
      refreshToken: tokensRes.refreshToken,
    };
  }

  @Post('signin')
  @ApiOkResponse({ type: SigninResponse })
  async signin(@Body() body: SigninRequest): Promise<SigninResponse> {
    const getUserRes = await this.userQueryHandler.getUserByEmail(body.email);

    const signinRes = await this.authCommandHandler.signin({
      userId: getUserRes.id,
      password: body.password,
    });

    return {
      accessToken: signinRes.accessToken,
      refreshToken: signinRes.refreshToken,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  @ApiOkResponse({})
  async signout(@Req() req: Request): Promise<void> {
    const jwtPayload = req['user'] as JwtPayloadDto;

    await this.authCommandHandler.signout({
      userId: jwtPayload.sub,
      tokenIdentifier: jwtPayload.account, // FIXME
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOkResponse({ type: RefreshTokensResponse })
  async refreshTokens(@Req() req: Request): Promise<RefreshTokensResponse> {
    // the refreshToken jwt has been validated by refreshTokenGuard
    const refreshToken = req.cookies.refresh_token;
    const jwtPayload = req['user'] as JwtPayloadDto;

    const res = await this.authCommandHandler.refreshTokens({
      refreshToken: refreshToken,
      userId: jwtPayload.sub,
    });

    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };
  }
}
