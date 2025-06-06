import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../impl/get-user-by-id.query';
import { User } from '../../entities/user.entity';
import { Inject, Logger } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../ports/repositories/user-repository.interface';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler
  implements IQueryHandler<GetUserByIdQuery, User>
{
  private readonly logger = new Logger(GetUserByIdHandler.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userProvider: UserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    try {
      return await this.userProvider.getUserById(query.id);
    } catch (error) {
      this.logger.error(
        `failed to get user by id ${query.id}: ${error.message}`,
      );
      throw error;
    }
  }
}
