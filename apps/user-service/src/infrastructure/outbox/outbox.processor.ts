import {
  UserActivatedIntegrationEvent,
  UserCreatedIntegrationEvent,
  UserDeactivatedIntegrationEvent,
  UserPasswordChangedIntegrationEvent,
  UserRoleChangedIntegrationEvent,
} from '@app/contracts';
import { NATS_JETSTREAM_CLIENT } from '@app/infrastructure';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private readonly jc = JSONCodec();

  private readonly topicRegistry: Record<string, string> = {
    [UserCreatedEvent.EVENT_NAME]: UserCreatedIntegrationEvent.TOPIC,
    [UserPasswordChangedEvent.EVENT_NAME]: UserPasswordChangedIntegrationEvent.TOPIC,
    [UserRoleChangedEvent.EVENT_NAME]: UserRoleChangedIntegrationEvent.TOPIC,
    [UserDeactivatedEvent.EVENT_NAME]: UserDeactivatedIntegrationEvent.TOPIC,
    [UserActivatedEvent.EVENT_NAME]: UserActivatedIntegrationEvent.TOPIC,
  };

  constructor(
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepository: Repository<OutboxEntity>,
    @Inject(NATS_JETSTREAM_CLIENT)
    private readonly js: JetStreamClient,
  ) {}

  @Cron('0 */5 * * * *') // EVERY_5_MINUTES
  async processOutbox() {
    const unpublishedEvents = await this.outboxRepository.find({
      where: { published: false },
      take: 100,
      order: { createdAt: 'ASC' },
    });

    if (unpublishedEvents.length === 0) return;

    for (const event of unpublishedEvents) {
      try {
        const topic = this.topicRegistry[event.eventType];
        if (!topic) {
          this.logger.warn(`Unknown event type: ${event.eventType}`);
          continue;
        }

        await this.js.publish(topic, this.jc.encode(event.payload), { msgID: event.id });

        await this.outboxRepository.update({ id: event.id, published: false }, { published: true });
      } catch (error) {
        this.logger.error(`Failed to process outbox event ${event.id}`, error);
      }
    }
  }
}
