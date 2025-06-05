import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SigninCommand } from '../impl/signin.command';
import { SigninDto } from '../dtos/signin.dto';
import { UnauthorizedError } from '@app/common/errors';
import { Inject, Logger } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../ports/repositories/auth.repository';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../../types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONFIG_TOKEN, AuthConfig } from '../../../configs/auth.config';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../../entities/refresh-token.entity';

@CommandHandler(SigninCommand)
export class SigninHandler implements ICommandHandler<SigninCommand> {
  private readonly logger = new Logger(SigninHandler.name);
  private readonly authConfig: AuthConfig;

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>(AUTH_CONFIG_TOKEN);
  }

  async execute(command: SigninCommand): Promise<SigninDto> {
    try {
      const credential = await this.authRepository.getCredential(
        command.userId,
      );

      const passwordMatches = await bcrypt.compare(
        command.password,
        credential.passwordHash,
      );
      if (!passwordMatches) {
        throw new UnauthorizedError("Password doesn't match");
      }

      // Generate access and refresh tokens
      const jwtPayload: JwtPayload = {
        sub: command.userId,
      };
      const refreshJwtId = crypto.randomUUID();
      const [accessToken, refreshToken] = await Promise.all([
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

      await this.authRepository.createRefreshToken(
        RefreshToken.create(command.userId, refreshJwtId),
      );

      return {
        refreshToken: refreshToken,
        accessToken: accessToken,
      };
    } catch (error) {
      this.logger.error(
        `error verifying password for user ${command.userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
