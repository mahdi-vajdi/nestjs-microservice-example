import { Injectable, Logger } from '@nestjs/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { UserCreated } from '@app/common/events/user/user-created.event';
import { User } from '../../../domain/entities/user.entity';
import { ExternalEventPublisher } from '../../../domain/ports/external-event-publisher/external-event-publisher';
import { NatsJetstreamService } from '@app/common/nats/nats-jetstream.service';
import { ClientProxy } from '@nestjs/microservices';
import * as crypto from 'node:crypto';

@Injectable()
export class NatsEventPublisher
  extends NatsJetstreamService
  implements ExternalEventPublisher
{
  logger = new Logger(NatsEventPublisher.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {
    super();
  }

  get client(): ClientProxy<Record<never, Function>, string> {
    return this.natsClient;
  }

  get module(): string {
    return 'user-service';
  }

  async userCreated(user: User): Promise<void> {
    await this.emit(
      crypto.randomUUID(),
      new UserCreated({
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        createdAt: user.createdAt,
      }),
    );
  }
}
