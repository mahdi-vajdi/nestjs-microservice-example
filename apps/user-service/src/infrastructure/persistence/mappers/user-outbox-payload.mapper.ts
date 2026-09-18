import { DomainEvent } from '@app/common';

import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserPasswordChangedEvent,
  UserRoleChangedEvent,
} from '../../../domain';

export function buildUserIntegrationPayload(event: DomainEvent): Record<string, unknown> {
  if (event instanceof UserCreatedEvent) {
    return {
      userId: event.aggregateId,
      email: event.email,
      role: event.role,
      passwordHash: event.passwordHash,
      occurredOn: event.occurredAt,
    };
  }
  if (event instanceof UserPasswordChangedEvent) {
    return {
      userId: event.aggregateId,
      newPasswordHash: event.newPasswordHash,
      occurredOn: event.occurredAt,
    };
  }
  if (event instanceof UserRoleChangedEvent) {
    return { userId: event.aggregateId, newRole: event.role, occurredOn: event.occurredAt };
  }
  if (event instanceof UserDeactivatedEvent) {
    return { userId: event.aggregateId, occurredOn: event.occurredAt };
  }
  if (event instanceof UserActivatedEvent) {
    return { userId: event.aggregateId, occurredOn: event.occurredAt };
  }
  return { userId: event.aggregateId };
}
