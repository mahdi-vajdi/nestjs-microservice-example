import { Injectable, Logger } from '@nestjs/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { lastValueFrom } from 'rxjs';
import { UserCreated } from '@app/common/events/user/user-created.event';
import { User } from '../../../domain/entities/user.entity';
import { EventPublisher } from '../../../domain/event-publisher/event-publisher.interface';

@Injectable()
export class NatsEventPublisher implements EventPublisher {
  private readonly logger = new Logger(NatsEventPublisher.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {}

  async userCreated(user: User): Promise<void> {
    const event = new UserCreated({
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });

    try {
      await lastValueFrom(
        this.natsClient.emit<void, UserCreated>(event.getKey(), event),
      );
    } catch (error) {
      this.logger.error(
        `error adding to ${event.getKey()} stream, error: ${error}`,
      );
      throw error;
    }
  }
}
