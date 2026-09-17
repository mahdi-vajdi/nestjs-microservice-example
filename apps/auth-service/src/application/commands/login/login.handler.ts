import { randomUUID } from 'node:crypto';

import { InvalidInputException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  PasswordVerifierPort,
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredentialRepositoryPort,
} from '../../../domain';
import { OutboxEntity } from '../../../infrastructure/persistence/entities/outbox.entity';
import { AuthResponseDto } from '../../dtos/auth.response.dto';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepo: UserCredentialRepositoryPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly tokenSessionRepo: TokenSessionRepositoryPort,
    private readonly passwordVerifier: PasswordVerifierPort,
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepo: Repository<OutboxEntity>,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      throw new InvalidInputException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new InvalidInputException('User account is deactivated');
    }

    const isPasswordValid = await this.passwordVerifier.verify(command.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidInputException('Invalid email or password');
    }

    const accessTokenData = await this.tokenGenerator.generateAccessToken(user.id, user.role);
    const refreshTokenData = await this.tokenGenerator.generateRefreshToken(user.id);

    await this.tokenSessionRepo.store(refreshTokenData.token, user.id, refreshTokenData.expiresIn);

    const event = new OutboxEntity();
    event.id = randomUUID();
    event.aggregateId = user.id;
    event.type = 'UserLoggedInEvent';
    event.payload = {};
    event.published = false;

    await this.outboxRepo.save(event);

    return new AuthResponseDto(
      accessTokenData.token,
      refreshTokenData.token,
      accessTokenData.expiresIn,
    );
  }
}
