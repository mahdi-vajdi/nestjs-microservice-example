import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountCreatedEvent } from '../../../domain/events/account-created.event';
import { Inject, Logger } from '@nestjs/common';
import {
  AGENT_WRITER,
  IAgentWriter,
} from '../../../infrastructure/command-client/providers/agent.writer';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  private readonly logger = new Logger(AccountCreatedHandler.name);

  constructor(
    @Inject(AGENT_WRITER) private readonly agentWriter: IAgentWriter,
  ) {}

  async handle(event: AccountCreatedEvent): Promise<void> {
    // create a default agent when a new account created
    this.logger.log('Account created: ', event);
  }
}
