import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dead_letters', { schema: 'auth' })
export class DeadLetterEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'stream', type: 'varchar', length: 255 })
  stream!: string;

  @Column({ name: 'consumer', type: 'varchar', length: 255 })
  consumer!: string;

  @Column({ name: 'stream_seq', type: 'bigint' })
  streamSeq!: number;

  @Column({ name: 'deliveries', type: 'int' })
  deliveries!: number;

  @Column({ name: 'advisory', type: 'jsonb' })
  advisory!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
