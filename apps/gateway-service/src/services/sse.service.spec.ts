import type { MessageEvent } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { firstValueFrom, toArray } from 'rxjs';

import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;
  let mockRedisClient: jest.Mocked<Partial<RedisClientType>>;
  let mockSubscriberClient: jest.Mocked<Partial<RedisClientType>>;
  let subscribeCallback: (message: string) => void;

  beforeEach(async () => {
    mockSubscriberClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn().mockImplementation((_channel, callback) => {
        subscribeCallback = callback;
        return Promise.resolve();
      }),
      unsubscribe: jest.fn().mockResolvedValue(undefined),
      quit: jest.fn().mockResolvedValue(undefined),
    };

    mockRedisClient = {
      duplicate: jest.fn().mockReturnValue(mockSubscriberClient as RedisClientType),
      publish: jest.fn().mockResolvedValue(1),
    };

    service = new SseService(mockRedisClient as RedisClientType);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should initialize duplicate client and subscribe to Redis channel', () => {
    expect(mockRedisClient.duplicate).toHaveBeenCalled();
    expect(mockSubscriberClient.connect).toHaveBeenCalled();
    expect(mockSubscriberClient.subscribe).toHaveBeenCalledWith(
      'sse:user-events',
      expect.any(Function),
    );
  });

  it('should publish notification to Redis channel on notifyClient', async () => {
    const userId = 'user-123';
    const data = { status: 'COMPLETED', message: 'Hello' };

    await service.notifyClient(userId, data);

    expect(mockRedisClient.publish).toHaveBeenCalledWith(
      'sse:user-events',
      JSON.stringify({ userId, data }),
    );
  });

  it('should stream message to matching user subscriber', async () => {
    const targetUserId = 'user-123';
    const otherUserId = 'user-456';
    const receivedMessages: MessageEvent[] = [];

    const subscription = service.subscribe(targetUserId).subscribe((msg) => {
      receivedMessages.push(msg);
    });

    // Simulate incoming Redis pub/sub messages
    subscribeCallback(
      JSON.stringify({ userId: otherUserId, data: { info: 'for other user' } }),
    );
    subscribeCallback(
      JSON.stringify({ userId: targetUserId, data: { info: 'for target user' } }),
    );

    expect(receivedMessages).toHaveLength(1);
    expect(receivedMessages[0]).toEqual({
      data: { info: 'for target user' },
    });

    subscription.unsubscribe();
  });

  it('should unsubscribe and quit subscriber client on destroy', async () => {
    await service.onModuleDestroy();

    expect(mockSubscriberClient.unsubscribe).toHaveBeenCalledWith('sse:user-events');
    expect(mockSubscriberClient.quit).toHaveBeenCalled();
  });
});
