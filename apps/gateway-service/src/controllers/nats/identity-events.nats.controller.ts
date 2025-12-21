import { UserCreatedIntegrationEvent } from '@app/shared/contracts/events/user-created.event';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';

import { SseService } from '../../services/sse.service';

@Controller()
export class IdentityEventsNatsController {
  private readonly logger = new Logger(IdentityEventsNatsController.name);

  constructor(private readonly sseService: SseService) {}

  @EventPattern(UserCreatedIntegrationEvent.TOPIC)
  async handleUserCreatedEvent(
    @Payload() data: UserCreatedIntegrationEvent,
    @Ctx() _context: NatsContext,
  ) {
    this.logger.log(`Received event: ${UserCreatedIntegrationEvent.TOPIC} ${data.email}`);

    this.sseService.notifyClient(data.userId, {
      status: 'COMPLETED',
      message: 'User account created successfully',
      user: data,
    });
  }
}
