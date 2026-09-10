import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { User, UserRepositoryPort } from '../../../domain';
import { UserEntity } from '../entities/user.entity';
import { OutboxEntity } from '../entities/outbox.entity';
import { UserMapper } from '../mappers/user.mapper';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UserPostgresRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OutboxEntity)
    private readonly outboxRepository: Repository<OutboxEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.userRepository.findOne({ where: { id } });
      if (!entity) return null;
      return UserMapper.toDomain(entity);
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by id', { cause: error });
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.userRepository.findOne({ where: { email } });
      if (!entity) return null;
      return UserMapper.toDomain(entity);
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email', { cause: error });
    }
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
        const outboxEntities = events.map(event => {
          const outbox = new OutboxEntity();
          outbox.id = randomUUID();
          outbox.aggregateId = user.id;
          outbox.eventType = event.constructor.name;
          outbox.payload = { ...event };
          outbox.published = false;
          return outbox;
        });

        await queryRunner.manager.save(OutboxEntity, outboxEntities);
        user.commit();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving user and outbox events', { cause: error });
    } finally {
      await queryRunner.release();
    }
  }
}
