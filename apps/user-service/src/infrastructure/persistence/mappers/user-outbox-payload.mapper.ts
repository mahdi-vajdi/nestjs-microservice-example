import { DomainEvent } from '@app/common';
import {
  UserActivatedIntegrationEvent,
  UserCreatedIntegrationEvent,
  UserDeactivatedIntegrationEvent,
  UserPasswordChangedIntegrationEvent,
  UserRoleChangedIntegrationEvent,
} from '@app/contracts';
import { getCorrelationId } from '@app/infrastructure';

import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserPasswordChangedEvent,
  UserRoleChangedEvent,
} from '../../../domain';

export class UserOutboxPayloadMapper {
  static toIntegrationPayload(event: DomainEvent): Record<string, unknown> {
    const correlationId = event.correlationId ?? getCorrelationId();

    if (event instanceof UserCreatedEvent) {
      return {
        ...new UserCreatedIntegrationEvent(
          event.eventId,
          event.aggregateId,
          event.email,
          event.role,
          event.passwordHash,
          event.occurredAt,
          correlationId,
        ),
      };
    }

    if (event instanceof UserPasswordChangedEvent) {
      return {
        ...new UserPasswordChangedIntegrationEvent(
          event.eventId,
          event.aggregateId,
          event.newPasswordHash,
          event.occurredAt,
          correlationId,
        ),
      };
    }

    if (event instanceof UserRoleChangedEvent) {
      return {
        ...new UserRoleChangedIntegrationEvent(
          event.eventId,
          event.aggregateId,
          event.role,
          event.occurredAt,
          correlationId,
        ),
      };
    }

    if (event instanceof UserDeactivatedEvent) {
      return {
        ...new UserDeactivatedIntegrationEvent(
          event.eventId,
          event.aggregateId,
          event.occurredAt,
          correlationId,
        ),
      };
    }

    if (event instanceof UserActivatedEvent) {
      return {
        ...new UserActivatedIntegrationEvent(
          event.eventId,
          event.aggregateId,
          event.occurredAt,
          correlationId,
        ),
      };
    }

    return {
      eventId: event.eventId,
      userId: event.aggregateId,
      occurredAt: event.occurredAt,
      ...(correlationId ? { correlationId } : {}),
    };
  }
}
