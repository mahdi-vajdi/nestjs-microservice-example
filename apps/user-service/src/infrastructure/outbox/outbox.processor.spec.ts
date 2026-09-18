import { UserCreatedIntegrationEvent } from '@app/contracts';
import type { JetStreamClient } from 'nats';
import type { Repository } from 'typeorm';

import { OutboxEntity } from '../persistence/entities/outbox.entity';
import { OutboxProcessor } from './outbox.processor';

describe('OutboxProcessor', () => {
  let processor: OutboxProcessor;
  let mockOutboxRepo: jest.Mocked<Partial<Repository<OutboxEntity>>>;
  let mockNatsClient: jest.Mocked<Partial<JetStreamClient>>;

  beforeEach(() => {
    mockOutboxRepo = {
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({}),
    };

    mockNatsClient = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    processor = new OutboxProcessor(
      mockOutboxRepo as Repository<OutboxEntity>,
      mockNatsClient as JetStreamClient,
    );
  });

  it('should publish pending outbox events to Nats and mark as published', async () => {
    const event = {
      id: 'event-uuid-1',
      aggregateId: 'user-uuid-1',
      eventType: 'UserCreatedEvent',
      payload: { email: 'test@example.com', role: 'CUSTOMER' },
      published: false,
      createdAt: new Date('2026-09-03T20:00:00.000Z'),
    } as OutboxEntity;

    mockOutboxRepo.find.mockResolvedValue([event]);

    await processor.processOutbox();

    expect(mockNatsClient.publish).toHaveBeenCalledTimes(1);
    expect(mockNatsClient.publish).toHaveBeenCalledWith(
      UserCreatedIntegrationEvent.TOPIC,
      expect.anything(),
      { msgID: event.id },
    );

    expect(mockOutboxRepo.update).toHaveBeenCalledWith(
      { id: event.id, published: false },
      { published: true },
    );
  });

  it('should not mark event as published if emit throws an error', async () => {
    const event = {
      id: 'event-uuid-2',
      aggregateId: 'user-uuid-2',
      eventType: 'UserCreatedEvent',
      payload: { email: 'fail@example.com', role: 'CUSTOMER' },
      published: false,
      createdAt: new Date(),
    } as OutboxEntity;

    mockOutboxRepo.find.mockResolvedValue([event]);
    mockNatsClient.publish.mockRejectedValue(new Error('NATS error'));

    await processor.processOutbox();

    expect(mockNatsClient.publish).toHaveBeenCalledTimes(1);
    expect(mockOutboxRepo.update).not.toHaveBeenCalled();
  });
});
