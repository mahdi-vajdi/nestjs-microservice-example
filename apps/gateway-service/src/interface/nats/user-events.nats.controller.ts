import { UserCreatedIntegrationEvent } from '@app/contracts';
import { JetStreamContext } from '@app/infrastructure';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

import { SseService } from '../../services/sse.service';

@Controller()
export class UserEventsNatsController {
  private readonly logger = new Logger(UserEventsNatsController.name);

  constructor(private readonly sseService: SseService) {}

  @EventPattern(UserCreatedIntegrationEvent.TOPIC)
  async handleUserCreated(
    @Payload() event: UserCreatedIntegrationEvent,
    @Ctx() context: JetStreamContext,
  ): Promise<void> {
    const msg = context.message;

    try {
      this.logger.log(
        `Received event: ${UserCreatedIntegrationEvent.TOPIC} for user ${event.email} (${event.userId})`,
      );

      await this.sseService.notifyClient(event.userId, {
        status: 'COMPLETED',
        message: 'User account created successfully',
        user: event,
      });

      msg.ack();
    } catch (err) {
      this.logger.error(`Error processing event ${UserCreatedIntegrationEvent.TOPIC}:`, err);
      msg.nak(1000);
    }
  }
}
