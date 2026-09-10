import { BaseOrmEntity } from '@app/infrastructure';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'outbox',
  schema: 'identity',
  comment: 'Saved the events that are published to the event bus.',
})
export class OutboxEntity extends BaseOrmEntity {
  @Column({ type: 'uuid' })
  aggregateId!: string;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({ type: 'jsonb' })
  payload!: object;

  @Column({ type: 'boolean', default: false })
  published!: boolean;
}
