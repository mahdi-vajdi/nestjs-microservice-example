import { NotFoundException } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { UserId, UserRepositoryPort } from '../../../domain';
import { DeactivateUserCommand } from './deactivate-user.command';

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserHandler implements ICommandHandler<DeactivateUserCommand> {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeactivateUserCommand): Promise<void> {
    const userId = UserId.create(command.userId);
    const existing = await this.userRepository.findById(userId.value);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const user = this.eventPublisher.mergeObjectContext(existing);
    user.deactivate();
    await this.userRepository.save(user);
    user.commit();
  }
}
