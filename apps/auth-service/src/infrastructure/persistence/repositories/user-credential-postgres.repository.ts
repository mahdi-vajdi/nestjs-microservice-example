import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialRepositoryPort, UserCredential } from '../../../domain';
import { UserCredentialEntity } from '../entities/user-credential.entity';

@Injectable()
export class UserCredentialPostgresRepository implements UserCredentialRepositoryPort {
  constructor(
    @InjectRepository(UserCredentialEntity, 'postgres')
    private readonly repo: Repository<UserCredentialEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserCredential | null> {
    const entity = await this.repo.findOneBy({ email });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async findByUserId(userId: string): Promise<UserCredential | null> {
    const entity = await this.repo.findOneBy({ user_id: userId });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async save(user: UserCredential): Promise<void> {
    const entity = this.mapToEntity(user);
    await this.repo.save(entity);
  }

  private mapToDomain(entity: UserCredentialEntity): UserCredential {
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

  private mapToEntity(domain: UserCredential): UserCredentialEntity {
    const entity = new UserCredentialEntity();
    entity.user_id = domain.id;
    entity.email = domain.email;
    entity.password_hash = domain.passwordHash;
    entity.role = domain.role;
    entity.is_active = domain.isActive;
    return entity;
  }
}
