import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCredential, UserCredentialRepositoryPort } from '../../../domain';
import { UserCredentialEntity } from '../entities/user-credential.entity';
import { UserCredentialMapper } from '../mappers/user-credential.mapper';

@Injectable()
export class UserCredentialPostgresRepository implements UserCredentialRepositoryPort {
  constructor(
    @InjectRepository(UserCredentialEntity, 'postgres')
    private readonly repo: Repository<UserCredentialEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserCredential | null> {
    const entity = await this.repo.findOneBy({ email });
    if (!entity) return null;
    return UserCredentialMapper.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<UserCredential | null> {
    const entity = await this.repo.findOneBy({ user_id: userId });
    if (!entity) return null;
    return UserCredentialMapper.toDomain(entity);
  }

  async save(user: UserCredential): Promise<void> {
    const entity = UserCredentialMapper.toEntity(user);
    await this.repo.save(entity);
  }
}
