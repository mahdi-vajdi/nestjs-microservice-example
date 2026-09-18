import { UserLoggedInIntegrationEvent } from '@app/contracts';
import { NATS_JETSTREAM_CLIENT } from '@app/infrastructure';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { JetStreamClient } from 'nats';
import { JSONCodec } from 'nats';
import { Repository } from 'typeorm';

import { UserLoggedInEvent } from '../../domain';
import { OutboxEntity } from '../persistence/entities/outbox.entity';
import { AuthOutboxPayloadMapper } from '../persistence/mappers/auth-outbox-payload.mapper';

@EventsHandler(UserLoggedInEvent)
export class AuthDomainEventsPublisher implements IEventHandler<UserLoggedInEvent> {
  private readonly logger = new Logger(AuthDomainEventsPublisher.name);
  private readonly jc = JSONCodec();

  constructor(
    @Inject(NATS_JETSTREAM_CLIENT) private readonly js: JetStreamClient,
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepo: Repository<OutboxEntity>,
  ) {}

  async handle(event: UserLoggedInEvent): Promise<void> {
    const payload = AuthOutboxPayloadMapper.build(event);
    const correlationId = (payload.correlationId as string) || 'none';
    try {
      this.logger.log(
        `Publishing event UserLoggedInEvent to topic ${UserLoggedInIntegrationEvent.TOPIC} [correlationId=${correlationId}]`,
      );
      await this.js.publish(UserLoggedInIntegrationEvent.TOPIC, this.jc.encode(payload), {
        msgID: event.eventId,
      });
      await this.outboxRepo.update({ id: event.eventId, published: false }, { published: true });
    } catch (err) {
      this.logger.error('Instant publish failed for UserLoggedInEvent', err);
    }
  }
}
