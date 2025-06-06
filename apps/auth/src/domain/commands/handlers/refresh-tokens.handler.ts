import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokensCommand } from '../impl/refresh-tokens.command';
import { RefreshTokensDto } from '../dtos/refresh-tokens.dto';
import crypto from 'node:crypto';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../ports/repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../types/jwt-payload.type';
import { AUTH_CONFIG_TOKEN, AuthConfig } from '../../../configs/auth.config';

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler
  implements ICommandHandler<RefreshTokensCommand>
{
  private readonly logger = new Logger(RefreshTokensHandler.name);
  private readonly authConfig: AuthConfig;

  constructor(
    configService: ConfigService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    this.authConfig = configService.get<AuthConfig>(AUTH_CONFIG_TOKEN);
  }

  async execute(command: RefreshTokensCommand): Promise<RefreshTokensDto> {
    try {
      const refreshToken = await this.authRepository.getRefreshToken(
        command.userId,
        command.identifier,
      );

      // Generate access and refresh tokens
      const jwtPayload: JwtPayload = {
        sub: command.userId,
      };
      const refreshJwtId = crypto.randomUUID();
      const [accessJWT, refreshJWT] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.authConfig.accessJWTSecret,
          expiresIn: '1d',
        }),
        await this.jwtService.signAsync(jwtPayload, {
          secret: this.authConfig.refreshJWTSecret,
          expiresIn: '7d',
          jwtid: refreshJwtId,
        }),
      ]);

      // Delete the old refresh token
      await this.authRepository.softDeleteRefreshToken(refreshToken.id);

      try {
        // Save the new refresh token
        await this.authRepository.createRefreshToken(
          RefreshToken.create(command.userId, refreshJwtId),
        );
      } catch (error) {
        this.logger.error(
          `error deleting old refresh token for user ${command.userId}: ${error.message}`,
        );

        // Restore the deleted refresh token
        await this.authRepository.restoreRefreshToken(refreshToken.id);

        throw error;
      }

      return {
        refreshToken: refreshJWT,
        accessToken: accessJWT,
      };
    } catch (error) {
      this.logger.error(
        `error refreshing tokens for user ${command.userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
