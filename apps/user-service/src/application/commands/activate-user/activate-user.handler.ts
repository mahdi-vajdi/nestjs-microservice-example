import { NotFoundException } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { ActivateUserCommand } from './activate-user.command';

@CommandHandler(ActivateUserCommand)
export class ActivateUserHandler implements ICommandHandler<ActivateUserCommand> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ActivateUserCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const existing = await this.userRepository.findById(userId.value);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const user = this.eventPublisher.mergeObjectContext(existing);
    user.activate();
    await this.userRepository.save(user);
    user.commit();
  }
}
