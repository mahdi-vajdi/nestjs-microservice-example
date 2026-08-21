import { UserCreatedIntegrationEvent } from '@app/shared/contracts/events/user-created.event';
import { OutboxEntity } from '@app/shared/infrastructure/database/postgres/outbox.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    @InjectRepository(OutboxEntity) private readonly outboxRepository: Repository<OutboxEntity>,
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
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
        this.natsClient.emit(UserCreatedIntegrationEvent.TOPIC, event.payload);

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
