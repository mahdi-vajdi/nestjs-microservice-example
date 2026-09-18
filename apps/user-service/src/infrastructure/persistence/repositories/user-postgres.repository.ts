import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRepositoryPort } from '../../../domain';
import { OutboxEntity } from '../entities/outbox.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserPostgresRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity, 'postgres')
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OutboxEntity, 'postgres')
    private readonly outboxRepository: Repository<OutboxEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { email } });
    if (!entity) return null;
    return UserMapper.toDomain(entity);
  }

  async save(user: User): Promise<void> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userEntity = UserMapper.toEntity(user);
      await queryRunner.manager.save(UserEntity, userEntity);

      const events = user.getUncommittedEvents();
      if (events.length > 0) {
        const outboxEntities = events.map((event) => {
          const outbox = new OutboxEntity();
          outbox.id = event.eventId;
          outbox.aggregateId = user.id;
          outbox.eventType = event.constructor.name;
          outbox.payload = { ...event } as Record<string, unknown>;
          outbox.published = false;
          return outbox;
        });

        await queryRunner.manager.save(OutboxEntity, outboxEntities);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
