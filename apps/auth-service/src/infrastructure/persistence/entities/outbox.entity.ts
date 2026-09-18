import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'outbox' })
export class OutboxEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column('uuid')
  aggregateId!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
