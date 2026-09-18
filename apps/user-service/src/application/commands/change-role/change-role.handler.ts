import { NotFoundException } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ChangeRoleCommand } from './change-role.command';

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleHandler implements ICommandHandler<ChangeRoleCommand> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangeRoleCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const existing = await this.userRepository.findById(userId.value);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const user = this.eventPublisher.mergeObjectContext(existing);
    user.changeRole(command.role);
    await this.userRepository.save(user);
    user.commit();
  }
}
