import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../impl/user-created.event';
import { Inject, Logger } from '@nestjs/common';
import {
  EXTERNAL_EVENT_PUBLISHER,
  ExternalEventPublisher,
} from '../../ports/external-event-publisher/external-event-publisher';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  constructor(
    @Inject(EXTERNAL_EVENT_PUBLISHER)
    private readonly externalEventPublisher: ExternalEventPublisher,
  ) {}

  async handle(event: UserCreatedEvent) {
    this.logger.log(`User created: ${event.user.id}`);
    await this.externalEventPublisher.userCreated(event.user);
  }
}
