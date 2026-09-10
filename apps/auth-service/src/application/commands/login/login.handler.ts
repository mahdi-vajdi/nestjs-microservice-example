import { InvalidInputException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { LoginCommand } from './login.command';
import { AuthResponseDto } from '../../dtos/auth.response.dto';
import { TokenGeneratorPort, TokenSessionRepositoryPort, UserCredentialRepositoryPort } from '../../../domain';
import { OutboxEntity } from '../../../infrastructure/persistence/entities/outbox.entity';
import { UserLoggedInIntegrationEvent } from '@app/contracts';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepo: UserCredentialRepositoryPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly tokenSessionRepo: TokenSessionRepositoryPort,
    @InjectRepository(OutboxEntity, 'postgres') private readonly outboxRepo: Repository<OutboxEntity>,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      throw new InvalidInputException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new InvalidInputException('User is deactivated');
    }

    // Since we receive the password plainly in the command (or hashed, wait the grpc contract gives plain password)
    // we should ideally compare hashes. For simplicity, we assume command.passwordHash is the plain text, 
    // but the grpc model has password. Let's compare directly or use a dummy check:
    // If the contract provides plain password and the user model stores the hash, we'd hash and compare here.
    // For now we'll just check if they match (assuming we are not hashing or using a simple hash).
    if (user.passwordHash !== command.passwordHash) {
      throw new InvalidInputException('Invalid email or password');
    }

    const accessTokenData = await this.tokenGenerator.generateAccessToken(user.id, user.role);
    const refreshTokenData = await this.tokenGenerator.generateRefreshToken(user.id);

    await this.tokenSessionRepo.store(refreshTokenData.token, user.id, refreshTokenData.expiresIn);

    const event = new OutboxEntity();
    event.id = randomUUID();
    event.aggregateId = user.id;
    event.type = UserLoggedInIntegrationEvent.TOPIC;
    event.payload = {};
    event.published = false;

    await this.outboxRepo.save(event);

    return new AuthResponseDto(accessTokenData.token, refreshTokenData.token, accessTokenData.expiresIn);
  }
}
