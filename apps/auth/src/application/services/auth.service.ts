import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../domain/repositories/auth.repository';
import { Credential } from '../../domain/entities/credential.entity';
import { DuplicateError } from '@app/common/errors';
import { AUTH_CONFIG_TOKEN, AuthConfig } from '../configs/auth.config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import * as crypto from 'node:crypto';
import { JwtPayload } from '../../domain/types/jwt-payload.type';
import { UnauthorizedError } from '@app/common/errors/unauthorized.error';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private readonly HASH_SALT_ROUNDS = 10;
  private readonly logger = new Logger(AuthService.name);
  private readonly authConfig: AuthConfig;

  constructor(
    configService: ConfigService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    this.authConfig = configService.get<AuthConfig>(AUTH_CONFIG_TOKEN);
  }

  async createPasswordCredential(
    userId: string,
    password: string,
  ): Promise<Credential> {
    try {
      const existingCredential =
        await this.authRepository.getCredential(userId);
      if (existingCredential) {
        throw new DuplicateError(
          'Credential already exists for the user. try updating.',
        );
      }

      const passwordHash = await bcrypt.hash(password, this.HASH_SALT_ROUNDS);

      return await this.authRepository.createCredential(
        Credential.create(userId, passwordHash),
      );
    } catch (error) {
      this.logger.error(
        `error creating password credential for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async signin(userId: string, password: string): Promise<SigninDto> {
    try {
      const credential = await this.authRepository.getCredential(userId);

      const passwordMatches = await bcrypt.compare(
        password,
        credential.passwordHash,
      );
      if (!passwordMatches) {
        throw new UnauthorizedError("Password doesn't match");
      }

      const refreshIdentifier = crypto.randomUUID();
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(userId),
        this.generateRefreshToken(userId, refreshIdentifier),
      ]);

      return {
        refreshToken: refreshToken,
        accessToken: accessToken,
      };
    } catch (error) {
      this.logger.error(
        `error verifying password for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async signoutUser(userId: string, identifier: string): Promise<boolean> {
    try {
      const refreshToken = await this.authRepository.getRefreshToken(
        userId,
        identifier,
      );

      return await this.authRepository.softDeleteRefreshToken(refreshToken.id);
    } catch (error) {
      this.logger.error(`error signing out user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async refreshTokens(
    userId: string,
    identifier: string,
  ): Promise<RefreshTokensDto> {
    try {
      const refreshToken = await this.authRepository.getRefreshToken(
        userId,
        identifier,
      );

      const refreshJwtId = crypto.randomUUID();
      const [accessJWT, refreshJWT] = await Promise.all([
        this.generateAccessToken(userId),
        this.generateRefreshToken(userId, refreshJwtId),
      ]);

      // Delete the old refresh token
      await this.authRepository.softDeleteRefreshToken(refreshToken.id);

      try {
        // Save the new refresh token
        await this.authRepository.createRefreshToken(
          RefreshToken.create(userId, refreshJwtId),
        );
      } catch (error) {
        this.logger.error(
          `error deleting old refresh token for user ${userId}: ${error.message}`,
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
        `error refreshing tokens for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
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

  private async generateRefreshToken(
    userId: string,
    jwtId: string,
  ): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId } as JwtPayload, {
      secret: this.authConfig.refreshJWTSecret,
      expiresIn: '7d',
      jwtid: jwtId,
    });
  }

  private async generateAccessToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId } as JwtPayload, {
      secret: this.authConfig.accessJWTSecret,
      expiresIn: '1d',
    });
  }
}
