import { NotFoundException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ActivateUserCommand } from './activate-user.command';

@CommandHandler(ActivateUserCommand)
export class ActivateUserHandler implements ICommandHandler<ActivateUserCommand> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: ActivateUserCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.activate();
    await this.userRepository.save(user);
  }
}
