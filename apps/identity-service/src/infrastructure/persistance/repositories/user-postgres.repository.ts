import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User, UserRepositoryPort } from '../../../domain';
import { OutboxEntity } from '../entities/outbox.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import * as crypto from 'node:crypto';

@Injectable()
export class UserPostgresRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity, 'postgres')
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource('postgres') private readonly dataSource: DataSource,
  ) {}

  async save(user: User): Promise<void> {
    const events = user.getUncommittedEvents();

    await this.dataSource.transaction(async (manager) => {
      const userEntity = UserMapper.toPersistence(user);
      await manager.save(userEntity);

      if (events.length > 0) {
        const outboxEntities = events.map((event) => {
          return manager.create(OutboxEntity, {
            id: crypto.randomUUID(),
            aggregateId: user.id,
            type: event.constructor.name,
            payload: Object.assign({}, event),
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
