import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { AccountModel } from '../../../infrastructure/database/mongo/models/account.model';
import { Inject } from '@nestjs/common';
import {
  ACCOUNT_PROVIDER,
  IAccountProvider,
} from '../../../infrastructure/database/providers/account.provider';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AccountModel | null>
{
  constructor(
    @Inject(ACCOUNT_PROVIDER)
    private readonly accountProvider: IAccountProvider,
  ) {}

  async execute({ email }: GetByEmailQuery): Promise<AccountModel | null> {
    return await this.accountProvider.findOneByEmail(email);
  }
}
