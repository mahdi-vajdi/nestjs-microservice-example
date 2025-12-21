import { User, UserRepositoryPort } from '@app/identity/domain';
import { UserEntity } from '@app/identity/infrastructure/persistance/entities/user.entity';
import { UserMapper } from '@app/identity/infrastructure/persistance/mapppers/user.mapper';
import { OutboxEntity } from '@app/shared/infrastructure/database/postgres/outbox.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostgresUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async save(user: User): Promise<void> {
    const events = user.getUncommittedEvents();

    await this.dataSource.transaction(async (manager) => {
      const userEntity = UserMapper.toPersistence(user);
      await manager.save(userEntity);

      if (events.length > 0) {
        const outboxEntities = events.map((event) => {
          return manager.create(OutboxEntity, {
            aggregateId: user.id,
            type: event.constructor.name,
            payload: event,
            published: false,
          });
        });
        await manager.save(outboxEntities);
      }
    });

    user.commit();
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
