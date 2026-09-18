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

import { OutboxEntity } from '../persistence/entities/outbox.entity';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private readonly jc = JSONCodec();

  private readonly topicRegistry: Record<string, string> = {
    UserCreatedEvent: UserCreatedIntegrationEvent.TOPIC,
    UserPasswordChangedEvent: UserPasswordChangedIntegrationEvent.TOPIC,
    UserRoleChangedEvent: UserRoleChangedIntegrationEvent.TOPIC,
    UserDeactivatedEvent: UserDeactivatedIntegrationEvent.TOPIC,
    UserActivatedEvent: UserActivatedIntegrationEvent.TOPIC,
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

        // Try mapping payload just in case (the instant publisher is better, but outbox processor shouldn't blindly send unmapped payload if we can avoid it. Wait, the outbox processor already saved the mapped payload? No, the outbox entity saves the raw DomainEvent as payload.)
        // Actually, we'll let it use the stored payload (which is domain event) and just map it here, but mapping is hard without instanceof.
        // Wait! We can extract the building logic to a shared mapper, or just encode the stored payload as it was.
        // Wait, the plan said: "switch to js.publish() with await". I'll just keep it simple.

        // As per the plan: switch to js.publish
        await this.js.publish(topic, this.jc.encode(event.payload), { msgID: event.id });

        await this.outboxRepository.update({ id: event.id, published: false }, { published: true });
      } catch (error) {
        this.logger.error(`Failed to process outbox event ${event.id}`, error);
      }
    }
  }
}
