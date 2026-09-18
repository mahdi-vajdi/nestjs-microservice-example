import { REDIS_CLIENT } from '@app/infrastructure';
import {
  Inject,
  Injectable,
  Logger,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { filter, map, Observable, Subject } from 'rxjs';

export interface SseEventMessage {
  userId: string;
  data: string | object;
}

@Injectable()
export class SseService implements OnModuleInit, OnModuleDestroy {
  private static readonly CHANNEL = 'sse:user-events';
  private readonly logger = new Logger(SseService.name);
  private readonly localStream = new Subject<SseEventMessage>();
  private subscriberClient?: RedisClientType;

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType) {}

  async onModuleInit(): Promise<void> {
    try {
      this.subscriberClient = this.redisClient.duplicate();
      await this.subscriberClient.connect();

      await this.subscriberClient.subscribe(SseService.CHANNEL, (message: string) => {
        try {
          const parsed = JSON.parse(message) as SseEventMessage;
          this.localStream.next(parsed);
        } catch (err) {
          this.logger.error('Failed to parse SSE event message from Redis', err);
        }
      });
      this.logger.log(`Subscribed to Redis channel '${SseService.CHANNEL}' for SSE fan-out`);
    } catch (err) {
      this.logger.error('Failed to initialize Redis SSE subscriber', err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.subscriberClient) {
      try {
        await this.subscriberClient.unsubscribe(SseService.CHANNEL);
        await this.subscriberClient.quit();
      } catch (err) {
        this.logger.error('Error closing Redis SSE subscriber', err);
      }
    }
  }

  async notifyClient(userId: string, data: string | object): Promise<void> {
    const payload: SseEventMessage = { userId, data };
    await this.redisClient.publish(SseService.CHANNEL, JSON.stringify(payload));
  }

  subscribe(userId: string): Observable<MessageEvent> {
    return this.localStream.asObservable().pipe(
      filter((event) => event.userId === userId),
      map((event): MessageEvent => ({
        data: event.data,
      })),
    );
  }
}
