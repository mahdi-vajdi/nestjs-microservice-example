import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserId } from '../../../domain';
import { ChangeRoleCommand } from './change-role.command';
import { NotFoundException } from '@app/common';

@CommandHandler(ChangeRoleCommand)
export class ChangeRoleHandler implements ICommandHandler<ChangeRoleCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

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
