import { BaseOrmEntity } from '@app/shared/infrastructure/database/postgres/base.orm-entity';
import { Column, Entity } from 'typeorm';

@Entity('outbox')
export class OutboxEntity extends BaseOrmEntity {
  @Column({ type: 'uuid' })
  aggregateId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ type: 'boolean', default: false })
  published: boolean;
}
