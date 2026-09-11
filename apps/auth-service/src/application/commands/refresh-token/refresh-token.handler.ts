import { InvalidInputException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredentialRepositoryPort,
} from '../../../domain';
import { AuthResponseDto } from '../../dtos/auth.response.dto';
import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly userRepo: UserCredentialRepositoryPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly tokenSessionRepo: TokenSessionRepositoryPort,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthResponseDto> {
    const userId = await this.tokenSessionRepo.findUserIdByToken(command.refreshToken);
    if (!userId) {
      throw new InvalidInputException('Invalid or expired refresh token');
    }

    const user = await this.userRepo.findByUserId(userId);
    if (!user || !user.isActive) {
      throw new InvalidInputException('User not found or deactivated');
    }

    await this.tokenSessionRepo.revoke(command.refreshToken);

    const accessTokenData = await this.tokenGenerator.generateAccessToken(user.id, user.role);
    const refreshTokenData = await this.tokenGenerator.generateRefreshToken(user.id);

    await this.tokenSessionRepo.store(refreshTokenData.token, user.id, refreshTokenData.expiresIn);

    return new AuthResponseDto(
      accessTokenData.token,
      refreshTokenData.token,
      accessTokenData.expiresIn,
    );
  }
}
