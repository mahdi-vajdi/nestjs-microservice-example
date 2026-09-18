import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserCredential, UserCredentialRepositoryPort } from '../../../domain';
import { SyncUserCommand } from './sync-user.command';

@CommandHandler(SyncUserCommand)
export class SyncUserHandler implements ICommandHandler<SyncUserCommand> {
  private readonly logger = new Logger(SyncUserHandler.name);

  constructor(private readonly userRepo: UserCredentialRepositoryPort) {}

  async execute(command: SyncUserCommand): Promise<void> {
    const { userId, payload } = command;

    if (payload.action === 'CREATE') {
      const existing = await this.userRepo.findByUserId(userId);
      if (!existing) {
        const user = UserCredential.create(
          userId,
          payload.email,
          payload.passwordHash,
          payload.role,
          true,
        );
        await this.userRepo.save(user);
      }
      return;
    }

    const user = await this.userRepo.findByUserId(userId);
    if (!user) {
      this.logger.warn(
        `User credential not found for action ${payload.action} (userId=${userId}). Message skipped or out of order.`,
      );
      return;
    }

    switch (payload.action) {
      case 'CHANGE_PASSWORD':
        user.updatePassword(payload.passwordHash);
        break;
      case 'CHANGE_ROLE':
        user.updateRole(payload.role);
        break;
      case 'DEACTIVATE':
        user.deactivate();
        break;
      case 'ACTIVATE':
        user.activate();
        break;
    }

    await this.userRepo.save(user);
  }
}
