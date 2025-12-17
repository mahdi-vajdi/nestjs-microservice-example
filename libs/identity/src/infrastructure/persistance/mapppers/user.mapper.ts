import { User } from '@app/identity/domain/src';
import { UserEntity } from '@app/identity/infrastructure/persistance/entities/user.entity';

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.id;
    entity.password_hash = user.passwordHash;
    entity.role = user.role;
    entity.is_active = user.isActive;
    entity.createdAt = user.createdAt;
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return User.reconstitute(
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.email,
      entity.password_hash,
      entity.role,
      entity.is_active,
    );
  }
}
