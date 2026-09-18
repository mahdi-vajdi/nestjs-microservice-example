import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { JetStreamClient, Msg } from 'nats';
import { JSONCodec } from 'nats';

import { NATS_CONNECTION } from './nats.config';

@Injectable()
export class DeadLetterAdvisoryService implements OnModuleInit {
  private readonly logger = new Logger(DeadLetterAdvisoryService.name);
  private readonly jc = JSONCodec();

  constructor(@Inject(NATS_CONNECTION) private readonly nc: any) {}

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
        this.processAdvisory(m);
      }
    })().catch((err) => {
      this.logger.error('Error in DLQ advisory loop', err);
    });
    
    this.logger.log('Subscribed to NATS JetStream Dead Letter advisories');
  }

  private processAdvisory(m: Msg): void {
    try {
      const data = this.jc.decode(m.data) as any;
      this.onDeadLetter(data);
    } catch (error) {
      this.logger.error('Failed to parse DLQ advisory message', error);
    }
  }

  protected onDeadLetter(advisory: any): void {
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
