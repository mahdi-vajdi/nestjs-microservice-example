import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../entities/user.entity';
import { Inject, Logger } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../ports/repositories/user-repository.interface';
import { GetUserByEmailQuery } from '../impl/get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, User>
{
  private readonly logger = new Logger(GetUserByEmailHandler.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userProvider: UserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User> {
    try {
      return await this.userProvider.getUserByEmail(query.email);
    } catch (error) {
      this.logger.error(
        `failed to get user by email ${query.email}: ${error.message}`,
      );
      throw error;
    }
  }
}
