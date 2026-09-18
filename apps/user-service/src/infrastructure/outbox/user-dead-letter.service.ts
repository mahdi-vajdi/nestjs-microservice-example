import { DeadLetterAdvisoryService, DlqAdvisory, NATS_CONNECTION } from '@app/infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { NatsConnection } from 'nats';
import { Repository } from 'typeorm';

import { DeadLetterEntity } from './dead-letter.entity';

@Injectable()
export class UserDeadLetterService extends DeadLetterAdvisoryService {
  constructor(
    @Inject(NATS_CONNECTION) nc: NatsConnection,
    @InjectRepository(DeadLetterEntity, 'postgres')
    private readonly dlqRepo: Repository<DeadLetterEntity>,
  ) {
    super(nc);
  }

  protected override async onDeadLetter(advisory: DlqAdvisory): Promise<void> {
    await super.onDeadLetter(advisory);

    try {
      const entity = new DeadLetterEntity();
      entity.stream = advisory.stream;
      entity.consumer = advisory.consumer;
      entity.streamSeq = advisory.stream_seq;
      entity.deliveries = advisory.deliveries;
      entity.advisory = advisory as Record<string, unknown>;
      await this.dlqRepo.save(entity);
      this.logger.log(
        `[DLQ] Saved dead letter record for consumer ${advisory.consumer}, seq ${advisory.stream_seq}`,
      );
    } catch (err) {
      this.logger.error('[DLQ] Failed to persist dead letter advisory to database', err);
    }
  }
}
