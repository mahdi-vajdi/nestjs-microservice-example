import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserId } from '../../../domain';
import { UpdateLastLoginCommand } from './update-last-login.command';
import { NotFoundException } from '@app/common';

@CommandHandler(UpdateLastLoginCommand)
export class UpdateLastLoginHandler implements ICommandHandler<UpdateLastLoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

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
