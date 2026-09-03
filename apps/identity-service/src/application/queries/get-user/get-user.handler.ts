import { InvalidInputException, NotFoundException } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepositoryPort } from '../../../domain';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { GetUserQuery } from './get-user.query';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    if (!query?.id || typeof query.id !== 'string' || !UUID_REGEX.test(query.id)) {
      throw new InvalidInputException('User ID must be a valid UUID');
    }

    const user = await this.userRepo.findOneById(query.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${query.id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
