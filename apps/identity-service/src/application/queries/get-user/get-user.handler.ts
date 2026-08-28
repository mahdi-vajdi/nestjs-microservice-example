import { NotFoundException } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepositoryPort } from '../../../domain';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
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
