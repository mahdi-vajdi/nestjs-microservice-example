import { NotFoundException } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ChangePasswordCommand } from './change-password.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const existing = await this.userRepository.findById(userId.value);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const user = this.eventPublisher.mergeObjectContext(existing);
    user.changePassword(command.newPasswordHash);
    await this.userRepository.save(user);
    user.commit();
  }
}
