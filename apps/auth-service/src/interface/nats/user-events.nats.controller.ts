import { UserCreatedIntegrationEvent } from '@app/contracts'; // And others as well, for simplicity using strings or basic classes
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';

import { SyncUserCommand } from '../../application/commands/sync-user/sync-user.command';

@Controller()
export class UserEventsNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('user.UserCreated')
  async handleUserCreated(@Payload() data: any) {
    await this.commandBus.execute(
      new SyncUserCommand('CREATE', data.userId, {
        email: data.email,
        role: data.role,
        passwordHash: data.passwordHash || '', // In a real app we need it in the event or query it
      }),
    );
  }

  @EventPattern('user.PasswordChanged')
  async handlePasswordChanged(@Payload() data: any) {
    await this.commandBus.execute(
      new SyncUserCommand('CHANGE_PASSWORD', data.userId, {
        passwordHash: data.passwordHash,
      }),
    );
  }

  @EventPattern('user.RoleChanged')
  async handleRoleChanged(@Payload() data: any) {
    await this.commandBus.execute(
      new SyncUserCommand('CHANGE_ROLE', data.userId, {
        role: data.role,
      }),
    );
  }

  @EventPattern('user.UserDeactivated')
  async handleUserDeactivated(@Payload() data: any) {
    await this.commandBus.execute(new SyncUserCommand('DEACTIVATE', data.userId));
  }

  @EventPattern('user.UserActivated')
  async handleUserActivated(@Payload() data: any) {
    await this.commandBus.execute(new SyncUserCommand('ACTIVATE', data.userId));
  }
}
