import { UserCredential } from '../../../domain/models/user-credential.model';
import { UserCredentialEntity } from '../entities/user-credential.entity';

export class UserCredentialMapper {
  static toDomain(entity: UserCredentialEntity): UserCredential {
    return UserCredential.reconstitute(
      entity.user_id,
      entity.created_at,
      entity.updated_at,
      entity.email,
      entity.password_hash,
      entity.role,
      entity.is_active,
    );
  }

  static toEntity(domain: UserCredential): UserCredentialEntity {
    const entity = new UserCredentialEntity();
    entity.user_id = domain.id;
    entity.email = domain.email;
    entity.password_hash = domain.passwordHash;
    entity.role = domain.role;
    entity.is_active = domain.isActive;
    return entity;
  }
}
