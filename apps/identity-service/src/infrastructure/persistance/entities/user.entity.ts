import { BaseOrmEntity } from '@app/infrastructure';
import { Column, Entity } from 'typeorm';

import { UserRole } from '../../../domain/types/user-role.enum';

@Entity({
  name: 'users',
  schema: 'identity',
  comment: 'The users table.',
})
export class UserEntity extends BaseOrmEntity {
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
