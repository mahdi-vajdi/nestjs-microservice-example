import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../impl/create-account.command';
import { Types } from 'mongoose';
import { Account } from '../../../domain/entities/account.entity';
import { Inject } from '@nestjs/common';
import {
  ACCOUNT_PROVIDER,
  IAccountProvider,
} from '../../../infrastructure/database/providers/account.provider';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, void>
{
  constructor(
    @Inject(ACCOUNT_PROVIDER)
    private readonly accountProvider: IAccountProvider,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ email }: CreateAccountCommand): Promise<void> {
    const account = this.eventPublisher.mergeObjectContext(
      Account.create(new Types.ObjectId().toHexString(), email),
    );

    await this.accountProvider.add(account);
    account.commit();
  }
}
