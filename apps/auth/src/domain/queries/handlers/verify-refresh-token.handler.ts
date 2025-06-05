import { VerifyRefreshTokenQuery } from '../impl/verify-refresh-token.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../ports/repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AUTH_CONFIG_TOKEN, AuthConfig } from '../../../configs/auth.config';

@QueryHandler(VerifyRefreshTokenQuery)
export class VerifyRefreshTokenHandler
  implements IQueryHandler<VerifyRefreshTokenQuery>
{
  private readonly logger = new Logger(VerifyRefreshTokenHandler.name);
  private readonly authConfig: AuthConfig;

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>(AUTH_CONFIG_TOKEN);
  }

  async execute(query: VerifyRefreshTokenQuery): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(query.token, {
        secret: this.authConfig.refreshJWTSecret,
        complete: true,
      });

      const getToken = await this.authRepository.getRefreshToken(
        payload.sub,
        payload.jti,
      );

      return Boolean(getToken);
    } catch (error) {
      this.logger.error(`error verifying refresh token: ${error}`);
      throw error;
    }
  }
}
