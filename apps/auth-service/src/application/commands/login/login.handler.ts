import { InvalidInputException } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import {
  PasswordVerifierPort,
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredentialRepositoryPort,
} from '../../../domain';
import { AuthResponseDto } from '../../dtos/auth.response.dto';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepo: UserCredentialRepositoryPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly tokenSessionRepo: TokenSessionRepositoryPort,
    private readonly passwordVerifier: PasswordVerifierPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    const existingCredential = await this.userRepo.findByEmail(command.email);

    if (!existingCredential) {
      throw new InvalidInputException('Invalid email or password');
    }

    const credential = this.eventPublisher.mergeObjectContext(existingCredential);

    if (!credential.isActive) {
      throw new InvalidInputException('User account is deactivated');
    }

    const isValid = await this.passwordVerifier.verify(command.password, credential.passwordHash);
    if (!isValid) {
      throw new InvalidInputException('Invalid email or password');
    }

    const accessTokenData = await this.tokenGenerator.generateAccessToken(
      credential.id,
      credential.role,
    );
    const refreshTokenData = await this.tokenGenerator.generateRefreshToken(credential.id);

    await this.tokenSessionRepo.store(
      refreshTokenData.token,
      credential.id,
      refreshTokenData.expiresIn,
    );

    credential.login();
    await this.userRepo.save(credential);
    credential.commit();

    return new AuthResponseDto(
      accessTokenData.token,
      refreshTokenData.token,
      accessTokenData.expiresIn,
    );
  }
}
