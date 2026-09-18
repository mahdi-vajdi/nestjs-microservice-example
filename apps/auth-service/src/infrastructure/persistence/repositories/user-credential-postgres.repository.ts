import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCredential, UserCredentialRepositoryPort } from '../../../domain';
import { UserLoggedInEvent } from '../../../domain/events/user-logged-in.event';
import { OutboxEntity } from '../entities/outbox.entity';
import { UserCredentialEntity } from '../entities/user-credential.entity';
import { AuthOutboxPayloadMapper } from '../mappers/auth-outbox-payload.mapper';
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
          const outbox = new OutboxEntity();
          outbox.id = event.eventId;
          outbox.aggregateId = credential.id;
          outbox.type = event.eventName;
          outbox.payload = AuthOutboxPayloadMapper.build(event as UserLoggedInEvent);
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
