import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Msg, NatsConnection } from 'nats';
import { JSONCodec } from 'nats';

import { NATS_CONNECTION } from './nats.config';

export interface DlqAdvisory {
  stream: string;
  consumer: string;
  stream_seq: number;
  deliveries: number;
  domain?: string;
  account?: string;
  [key: string]: unknown;
}

@Injectable()
export class DeadLetterAdvisoryService implements OnModuleInit {
  protected readonly logger = new Logger(DeadLetterAdvisoryService.name);
  private readonly jc = JSONCodec<DlqAdvisory>();

  constructor(@Inject(NATS_CONNECTION) private readonly nc: NatsConnection) {}

  onModuleInit(): void {
    if (!this.nc) {
      this.logger.warn('NATS Connection not available, skipping Dead Letter setup.');
      return;
    }

    // Subscribe to JetStream Max Deliveries Advisory subject
    // Subject format: $JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES.<stream>.<consumer>
    const sub = this.nc.subscribe('$JS.EVENT.ADVISORY.CONSUMER.MAX_DELIVERIES.>');

    (async () => {
      for await (const m of sub) {
        await this.processAdvisory(m);
      }
    })().catch((err: unknown) => {
      this.logger.error('Error in DLQ advisory loop', err);
    });

    this.logger.log('Subscribed to NATS JetStream Dead Letter advisories');
  }

  private async processAdvisory(m: Msg): Promise<void> {
    try {
      const data = this.jc.decode(m.data);
      await this.onDeadLetter(data);
    } catch (error) {
      this.logger.error('Failed to parse DLQ advisory message', error);
    }
  }

  protected async onDeadLetter(advisory: DlqAdvisory): Promise<void> {
    const stream = advisory.stream;
    const consumer = advisory.consumer;
    const seq = advisory.stream_seq;
    const deliverCount = advisory.deliveries;

    this.logger.error(
      `[DLQ] Message permanently failed. Stream: ${stream}, Consumer: ${consumer}, Seq: ${seq}, Deliveries: ${deliverCount}`,
      advisory,
    );
  }
}
