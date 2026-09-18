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
    [UserCreatedEvent.EVENT_NAME]: UserCreatedIntegrationEvent.TOPIC,
    [UserPasswordChangedEvent.EVENT_NAME]: UserPasswordChangedIntegrationEvent.TOPIC,
    [UserRoleChangedEvent.EVENT_NAME]: UserRoleChangedIntegrationEvent.TOPIC,
    [UserDeactivatedEvent.EVENT_NAME]: UserDeactivatedIntegrationEvent.TOPIC,
    [UserActivatedEvent.EVENT_NAME]: UserActivatedIntegrationEvent.TOPIC,
  };

  constructor(
    @Inject(NATS_JETSTREAM_CLIENT) private readonly js: JetStreamClient,
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepo: Repository<OutboxEntity>,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    const topic = this.topicRegistry[event.eventName];
    if (!topic) return;

    const unpublished = await this.outboxRepo.findOne({
      where: { id: event.eventId, published: false },
    });
    if (!unpublished) return;

    const correlationId = (unpublished.payload?.correlationId as string) || 'none';

    try {
      this.logger.log(
        `Publishing event ${event.eventName} to topic ${topic} [correlationId=${correlationId}]`,
      );
      await this.js.publish(topic, this.jc.encode(unpublished.payload), { msgID: unpublished.id });
      await this.outboxRepo.update({ id: unpublished.id, published: false }, { published: true });
    } catch (err) {
      this.logger.error(
        `Instant publish failed for ${event.eventName} [correlationId=${correlationId}]`,
        err,
      );
    }
  }
}
