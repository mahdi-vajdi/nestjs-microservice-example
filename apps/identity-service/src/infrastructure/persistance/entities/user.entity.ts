import { BaseOrmEntity } from '@app/infrastructure';
import { Column, Entity, Index } from 'typeorm';

import { UserRole } from '../../../domain';

@Entity({
  name: 'users',
  schema: 'identity',
  comment: 'The users table.',
})
export class UserEntity extends BaseOrmEntity {
  @Index('users_email_uniq', { unique: true })
  @Column()
  email!: string;

  @Column()
  password_hash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @Column({ default: true })
  is_active!: boolean;
}
