import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserExistsQuery } from '../impl/user-exists.query';
import { Inject, Logger } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../ports/repositories/user-repository.interface';

@QueryHandler(UserExistsQuery)
export class UserExistsHandler
  implements IQueryHandler<UserExistsQuery, boolean>
{
  private readonly logger = new Logger(UserExistsHandler.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userProvider: UserRepository,
  ) {}

  async execute(query: UserExistsQuery): Promise<boolean> {
    try {
      return await this.userProvider.userExists(query.email, query.mobile);
    } catch (error) {
      this.logger.error(
        `failed to get user exist status by email ${query.email} and mobile ${query.mobile}: ${error.message}`,
      );
      throw error;
    }
  }
}
