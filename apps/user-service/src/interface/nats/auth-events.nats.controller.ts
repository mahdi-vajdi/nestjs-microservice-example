import { UserLoggedInIntegrationEvent } from '@app/contracts';
import { JetStreamContext } from '@app/infrastructure';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

import { UpdateLastLoginCommand } from '../../application/commands/update-last-login/update-last-login.command';

@Controller()
export class AuthEventsNatsController {
  private readonly logger = new Logger(AuthEventsNatsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(UserLoggedInIntegrationEvent.TOPIC)
  async handleUserLoggedIn(
    @Payload() data: UserLoggedInIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    try {
      if (data.userId) {
        const command = new UpdateLastLoginCommand(data.userId);
        await this.commandBus.execute(command);
      }
      ctx.message.ack();
    } catch (error: any) {
      this.logger.error(
        `Error processing UserLoggedInIntegrationEvent: ${error.message}`,
        error.stack,
      );
      ctx.message.nak(5_000);
    }
  }
}
