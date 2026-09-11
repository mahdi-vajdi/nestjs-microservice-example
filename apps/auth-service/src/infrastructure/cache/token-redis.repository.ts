import { REDIS_CLIENT } from '@app/infrastructure';
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

import { TokenSessionRepositoryPort } from '../../domain/ports/token-session.repository.port';

@Injectable()
export class TokenRedisRepository implements TokenSessionRepositoryPort {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  private getKey(token: string): string {
    return `auth:refresh:${token}`;
  }

  async store(token: string, userId: string, ttl: number): Promise<void> {
    await this.redis.set(this.getKey(token), userId, { EX: ttl });
  }

  async findUserIdByToken(token: string): Promise<string | null> {
    return this.redis.get(this.getKey(token));
  }

  async revoke(token: string): Promise<void> {
    await this.redis.del(this.getKey(token));
  }
}
