import { UserCreatedIntegrationEvent } from '@app/contracts';
import { NATS_JETSTREAM_CLIENT } from '@app/infrastructure';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import type { JetStreamClient } from 'nats';
import { JSONCodec } from 'nats';
import { Repository } from 'typeorm';

import { OutboxEntity } from '../persistance/entities/outbox.entity';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private readonly jc = JSONCodec();

  constructor(
    @InjectRepository(OutboxEntity) private readonly outboxRepository: Repository<OutboxEntity>,
    @Inject(NATS_JETSTREAM_CLIENT) private readonly js: JetStreamClient,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleOutbox() {
    const events = await this.outboxRepository
      .createQueryBuilder('outbox')
      .where('outbox.published = :published', { published: false })
      .orderBy('outbox.created_at', 'ASC')
      .limit(50)
      .getMany();

    for (const event of events) {
      try {
        const payload = {
          userId: event.aggregateId,
          ...event.payload,
          occurredOn: event.createdAt,
        };

        const encoded = this.jc.encode(payload);

        await this.js.publish(UserCreatedIntegrationEvent.TOPIC, encoded, {
          msgID: event.id,
        });

        event.published = true;
        await this.outboxRepository.save(event);

        this.logger.log(`Published Event ${event.type} for aggregate ${event.aggregateId}`);
      } catch (error) {
        this.logger.error(
          `Failed to publish event ${event.type} for aggregate ${event.aggregateId}`,
          error,
        );
      }
    }
  }
}
