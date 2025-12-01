import { BaseOrmEntity } from '@app/shared';
import { Column } from 'typeorm';
import { UserRole } from '@app/identity/domain/src/types/user-role.enum';

export class UserEntity extends BaseOrmEntity {
  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;
}
