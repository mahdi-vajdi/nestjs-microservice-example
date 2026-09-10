import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient } from 'redis';

import { redisConfig } from './redis.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [redisConfig.KEY],
      useFactory: async (config: ConfigType<typeof redisConfig>) => {
        const client = createClient({
          socket: {
            host: config.host,
            port: config.port,
          },
          password: config.password,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
