import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from '../../application/commands/update-last-login/update-last-login.command';

@Controller()
export class AuthEventsNatsController {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('auth.UserLoggedIn')
  async handleUserLoggedIn(@Payload() data: { userId: string }): Promise<void> {
    if (!data.userId) return;
    const command = new UpdateLastLoginCommand(data.userId);
    await this.commandBus.execute(command);
  }
}
