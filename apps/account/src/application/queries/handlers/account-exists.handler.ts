import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AccountExistsQuery } from '../impl/account-exists.query';
import { Inject } from '@nestjs/common';
import {
  ACCOUNT_PROVIDER,
  IAccountProvider,
} from '../../../infrastructure/database/providers/account.provider';

@QueryHandler(AccountExistsQuery)
export class AccountExistsHandler
  implements IQueryHandler<AccountExistsQuery, boolean>
{
  constructor(
    @Inject(ACCOUNT_PROVIDER)
    private readonly accountProvider: IAccountProvider,
  ) {}

  async execute(query: AccountExistsQuery): Promise<boolean> {
    const account = await this.accountProvider.findOneByEmail(query.email);
    return !!account;
  }
}
