import { DomainEvent } from '@app/common';
import {
  UserActivatedIntegrationEvent,
  UserCreatedIntegrationEvent,
  UserDeactivatedIntegrationEvent,
  UserPasswordChangedIntegrationEvent,
  UserRoleChangedIntegrationEvent,
} from '@app/contracts';
import { NATS_JETSTREAM_CLIENT } from '@app/infrastructure';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { JetStreamClient } from 'nats';
import { JSONCodec } from 'nats';
import { Repository } from 'typeorm';

import { UserActivatedEvent } from '../../domain';
import { UserCreatedEvent } from '../../domain';
import { UserDeactivatedEvent } from '../../domain';
import { UserPasswordChangedEvent } from '../../domain';
import { UserRoleChangedEvent } from '../../domain';
import { OutboxEntity } from '../persistence/entities/outbox.entity';

@EventsHandler(
  UserCreatedEvent,
  UserPasswordChangedEvent,
  UserRoleChangedEvent,
  UserDeactivatedEvent,
  UserActivatedEvent,
)
export class UserDomainEventsPublisher implements IEventHandler<DomainEvent> {
  private readonly logger = new Logger(UserDomainEventsPublisher.name);
  private readonly jc = JSONCodec();

  private readonly topicRegistry: Record<string, string> = {
    UserCreatedEvent: UserCreatedIntegrationEvent.TOPIC,
    UserPasswordChangedEvent: UserPasswordChangedIntegrationEvent.TOPIC,
    UserRoleChangedEvent: UserRoleChangedIntegrationEvent.TOPIC,
    UserDeactivatedEvent: UserDeactivatedIntegrationEvent.TOPIC,
    UserActivatedEvent: UserActivatedIntegrationEvent.TOPIC,
  };

  constructor(
    @Inject(NATS_JETSTREAM_CLIENT) private readonly js: JetStreamClient,
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepo: Repository<OutboxEntity>,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    const topic = this.topicRegistry[event.constructor.name];
    if (!topic) return;

    const payload = this.buildIntegrationPayload(event);

    try {
      await this.js.publish(topic, this.jc.encode(payload), { msgID: event.eventId });
      await this.outboxRepo.update({ id: event.eventId }, { published: true });
    } catch (err) {
      this.logger.error(`Instant publish failed for ${event.constructor.name}`, err);
    }
  }

  private buildIntegrationPayload(event: DomainEvent): Record<string, unknown> {
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
    return { userId: (event as DomainEvent).aggregateId };
  }
}
