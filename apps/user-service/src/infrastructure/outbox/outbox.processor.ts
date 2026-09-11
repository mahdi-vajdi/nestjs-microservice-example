import { NATS_JETSTREAM_CLIENT } from '@app/infrastructure';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OutboxEntity } from '../persistence/entities/outbox.entity';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  private readonly topicRegistry: Record<string, string> = {
    UserCreatedEvent: 'user.UserCreated',
    UserPasswordChangedEvent: 'user.PasswordChanged',
    UserRoleChangedEvent: 'user.RoleChanged',
    UserDeactivatedEvent: 'user.Deactivated',
    UserActivatedEvent: 'user.Activated',
  };

  constructor(
    @InjectRepository(OutboxEntity)
    private readonly outboxRepository: Repository<OutboxEntity>,
    @Inject(NATS_JETSTREAM_CLIENT)
    private readonly natsClient: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
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

        this.natsClient.emit(topic, event.payload);

        await this.outboxRepository.update({ id: event.id, published: false }, { published: true });
      } catch (error) {
        this.logger.error(`Failed to process outbox event ${event.id}`, error);
      }
    }
  }
}
