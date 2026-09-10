import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserId } from '../../../domain';
import { DeactivateUserCommand } from './deactivate-user.command';
import { NotFoundException } from '@app/common';

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserHandler implements ICommandHandler<DeactivateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: DeactivateUserCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId.value);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deactivate();
    await this.userRepository.save(user);
  }
}
