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

import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserPasswordChangedEvent,
  UserRoleChangedEvent,
} from '../../domain';
import { buildUserIntegrationPayload } from '../persistence/mappers/user-outbox-payload.mapper';
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

    const payload = buildUserIntegrationPayload(event);
    const correlationId = (payload.correlationId as string) || 'none';

    try {
      this.logger.log(
        `Publishing event ${event.constructor.name} to topic ${topic} [correlationId=${correlationId}]`,
      );
      await this.js.publish(topic, this.jc.encode(payload), { msgID: event.eventId });
      await this.outboxRepo.update({ id: event.eventId }, { published: true });
    } catch (err) {
      this.logger.error(
        `Instant publish failed for ${event.constructor.name} [correlationId=${correlationId}]`,
        err,
      );
    }
  }
}
