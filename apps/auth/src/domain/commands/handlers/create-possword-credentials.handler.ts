import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePasswordCredentialsCommand } from '../impl/create-password-credentials.command';
import { DuplicateError } from '@app/common/errors';
import * as bcrypt from 'bcryptjs';
import { Credential } from '../../entities/credential.entity';
import { Inject, Logger } from '@nestjs/common';
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from '../../ports/repositories/auth.repository';

@CommandHandler(CreatePasswordCredentialsCommand)
export class CreatePasswordCredentialsHandler
  implements ICommandHandler<CreatePasswordCredentialsCommand>
{
  private readonly HASH_SALT_ROUNDS = 10;
  private readonly logger = new Logger(CreatePasswordCredentialsHandler.name);

  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    command: CreatePasswordCredentialsCommand,
  ): Promise<Credential> {
    try {
      const existingCredential = await this.authRepository.getCredential(
        command.userId,
      );
      if (existingCredential) {
        throw new DuplicateError(
          'Credential already exists for the user. try updating.',
        );
      }

      const passwordHash = await bcrypt.hash(
        command.password,
        this.HASH_SALT_ROUNDS,
      );

      return await this.authRepository.createCredential(
        Credential.create(command.userId, passwordHash),
      );
    } catch (error) {
      this.logger.error(
        `error creating password credential for user ${command.userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
