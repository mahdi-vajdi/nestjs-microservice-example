import { UserCreatedIntegrationEvent } from '@app/contracts';
import {
  generateCorrelationId,
  JetStreamContext,
  runWithCorrelationId,
} from '@app/infrastructure';
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
    const correlationId = event.correlationId ?? generateCorrelationId();

    await runWithCorrelationId(correlationId, async () => {
      try {
        this.logger.log(
          `Received event: ${UserCreatedIntegrationEvent.TOPIC} for user ${event.email} (${event.userId}) [correlationId=${correlationId}]`,
        );

        await this.sseService.notifyClient(event.userId, {
          status: 'COMPLETED',
          message: 'User account created successfully',
          user: event,
        });

        msg.ack();
      } catch (err) {
        this.logger.error(
          `Error processing event ${UserCreatedIntegrationEvent.TOPIC} [correlationId=${correlationId}]:`,
          err,
        );
        msg.nak(1000);
      }
    });
  }
}
