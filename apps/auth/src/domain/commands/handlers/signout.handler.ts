import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignoutCommand } from '../impl/signout.command';
import { Inject, Logger } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../ports/repositories/auth.repository';

@CommandHandler(SignoutCommand)
export class SignoutHandler implements ICommandHandler<SignoutCommand> {
  private readonly logger = new Logger(SignoutHandler.name);

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: SignoutCommand): Promise<boolean> {
    try {
      const refreshToken = await this.authRepository.getRefreshToken(
        command.userId,
        command.identifier,
      );

      return await this.authRepository.softDeleteRefreshToken(refreshToken.id);
    } catch (error) {
      this.logger.error(
        `failed to signout user ${command.userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
