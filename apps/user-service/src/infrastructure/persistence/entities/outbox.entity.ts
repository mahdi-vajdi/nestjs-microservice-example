import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('outbox', { schema: 'user' })
export class OutboxEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'aggregate_id', type: 'uuid' })
  aggregateId!: string;

  @Column({ name: 'event_type', type: 'varchar', length: 255 })
  eventType!: string;

  @Column({ name: 'payload', type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ name: 'published', type: 'boolean', default: false })
  published!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
