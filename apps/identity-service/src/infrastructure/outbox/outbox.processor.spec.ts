import { UserCreatedIntegrationEvent } from '@app/contracts';
import type { JetStreamClient } from 'nats';
import { JSONCodec } from 'nats';
import type { Repository } from 'typeorm';

import { OutboxEntity } from '../persistance/entities/outbox.entity';
import { OutboxProcessor } from './outbox.processor';

describe('OutboxProcessor', () => {
  let processor: OutboxProcessor;
  let mockOutboxRepo: jest.Mocked<Partial<Repository<OutboxEntity>>>;
  let mockJs: jest.Mocked<Partial<JetStreamClient>>;
  const jc = JSONCodec();

  beforeEach(() => {
    mockOutboxRepo = {
      createQueryBuilder: jest.fn(),
      save: jest.fn().mockResolvedValue({} as OutboxEntity),
    };

    mockJs = {
      publish: jest.fn().mockResolvedValue({
        stream: 'IDENTITY_EVENTS',
        seq: 1,
        duplicate: false,
      }),
    };

    processor = new OutboxProcessor(
      mockOutboxRepo as Repository<OutboxEntity>,
      mockJs as JetStreamClient,
    );
  });

  it('should publish pending outbox events to JetStream with msgID deduplication', async () => {
    const event = {
      id: 'event-uuid-1',
      aggregateId: 'user-uuid-1',
      type: 'UserCreatedEvent',
      payload: { email: 'test@example.com', role: 'CUSTOMER' },
      published: false,
      createdAt: new Date('2026-09-03T20:00:00.000Z'),
    } as OutboxEntity;

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([event]),
    };

    (mockOutboxRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await processor.handleOutbox();

    expect(mockJs.publish).toHaveBeenCalledTimes(1);
    const [topic, encodedPayload, opts] = (mockJs.publish as jest.Mock).mock.calls[0];

    expect(topic).toBe(UserCreatedIntegrationEvent.TOPIC);
    expect(opts).toEqual({ msgID: 'event-uuid-1' });

    const decoded = jc.decode(encodedPayload) as Record<string, unknown>;
    expect(decoded.userId).toBe('user-uuid-1');
    expect(decoded.email).toBe('test@example.com');
    expect(decoded.role).toBe('CUSTOMER');

    expect(event.published).toBe(true);
    expect(mockOutboxRepo.save).toHaveBeenCalledWith(event);
  });

  it('should not mark event as published if JetStream publish throws an error', async () => {
    const event = {
      id: 'event-uuid-2',
      aggregateId: 'user-uuid-2',
      type: 'UserCreatedEvent',
      payload: { email: 'fail@example.com', role: 'CUSTOMER' },
      published: false,
      createdAt: new Date(),
    } as OutboxEntity;

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([event]),
    };

    (mockOutboxRepo.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
    (mockJs.publish as jest.Mock).mockRejectedValue(new Error('JetStream timeout'));

    await processor.handleOutbox();

    expect(mockJs.publish).toHaveBeenCalledTimes(1);
    expect(event.published).toBe(false);
    expect(mockOutboxRepo.save).not.toHaveBeenCalled();
  });
});
