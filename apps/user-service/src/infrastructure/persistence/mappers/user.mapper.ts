import { User, UserRole, UserSnapshot } from '../../../domain';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const snapshot: UserSnapshot = {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role as UserRole,
      isActive: entity.isActive,
      lastLoginAt: entity.lastLoginAt,
    };
    return User.reconstitute(snapshot);
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;
    entity.role = domain.role;
    entity.isActive = domain.isActive;
    entity.lastLoginAt = domain.lastLoginAt;
    return entity;
  }
}
