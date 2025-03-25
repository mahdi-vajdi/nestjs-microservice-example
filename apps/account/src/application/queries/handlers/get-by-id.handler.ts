import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { AccountModel } from '../../../infrastructure/database/mongo/models/account.model';
import { Inject } from '@nestjs/common';
import {
  ACCOUNT_PROVIDER,
  IAccountProvider,
} from '../../../infrastructure/database/providers/account.provider';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler
  implements IQueryHandler<GetByIdQuery, AccountModel | null>
{
  constructor(
    @Inject(ACCOUNT_PROVIDER)
    private readonly accountProvider: IAccountProvider,
  ) {}

  async execute({ id }: GetByIdQuery): Promise<AccountModel | null> {
    return await this.accountProvider.findOneById(id);
  }
}
