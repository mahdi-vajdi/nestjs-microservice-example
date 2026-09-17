import { NotFoundException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { UpdateLastLoginCommand } from './update-last-login.command';

@CommandHandler(UpdateLastLoginCommand)
export class UpdateLastLoginHandler implements ICommandHandler<UpdateLastLoginCommand> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: UpdateLastLoginCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.recordLastLogin();
    await this.userRepository.save(user);
  }
}
