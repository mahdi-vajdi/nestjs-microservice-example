import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserId } from '../../../domain';
import { ChangePasswordCommand } from './change-password.command';
import { NotFoundException } from '@app/common';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

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
