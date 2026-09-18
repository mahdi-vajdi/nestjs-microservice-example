import { getCorrelationId } from '@app/infrastructure';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCredential, UserCredentialRepositoryPort } from '../../../domain';
import { OutboxEntity } from '../entities/outbox.entity';
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

  async save(credential: UserCredential): Promise<void> {
    const events = credential.getUncommittedEvents();
    const queryRunner = this.repo.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(
        UserCredentialEntity,
        UserCredentialMapper.toEntity(credential),
      );

      if (events.length > 0) {
        const outboxEntities = events.map((event) => {
          const correlationId = event.correlationId ?? getCorrelationId();
          const outbox = new OutboxEntity();
          outbox.id = event.eventId;
          outbox.aggregateId = credential.id;
          outbox.type = event.constructor.name;
          outbox.payload = {
            userId: credential.id,
            occurredOn: event.occurredAt,
            ...(correlationId ? { correlationId } : {}),
          };
          outbox.published = false;
          return outbox;
        });
        await queryRunner.manager.save(OutboxEntity, outboxEntities);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
