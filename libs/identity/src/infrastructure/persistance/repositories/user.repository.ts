import { User, UserRepositoryPort } from '@app/identity/domain/src';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/identity/infrastructure/persistance/entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '@app/identity/infrastructure/persistance/mapppers/user.mapper';

export class PostgresUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = UserMapper.toPersistence(user);
    await this.userRepository.save(entity);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { email },
    });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findOneById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }
}
