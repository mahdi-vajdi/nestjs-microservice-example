import { getCorrelationId } from '@app/infrastructure';

import { UserLoggedInEvent } from '../../../domain/events/user-logged-in.event';

export class AuthOutboxPayloadMapper {
  static build(event: UserLoggedInEvent): Record<string, unknown> {
    const correlationId = event.correlationId ?? getCorrelationId();
    return {
      eventId: event.eventId,
      userId: event.aggregateId,
      occurredAt: event.occurredAt,
      ...(correlationId ? { correlationId } : {}),
    };
  }
}
