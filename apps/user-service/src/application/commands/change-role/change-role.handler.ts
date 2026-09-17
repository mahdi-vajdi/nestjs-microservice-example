import { NotFoundException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ChangeRoleCommand } from './change-role.command';

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleHandler implements ICommandHandler<ChangeRoleCommand> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: ChangeRoleCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const user = await this.userRepository.findById(userId.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.changeRole(command.role);
    await this.userRepository.save(user);
  }
}
