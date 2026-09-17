import { NotFoundException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ChangePasswordCommand } from './change-password.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.changePassword(command.newPasswordHash);
    await this.userRepository.save(user);
  }
}
