import { NotFoundException } from '@app/common';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { USER_REPOSITORY_PORT, UserId, UserRepositoryPort } from '../../../domain';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserResponseMapper } from '../../mappers/user-response.mapper';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const userId = UserId.create(query.id);
    const user = await this.userRepository.findById(userId.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseMapper.toDto(user);
  }
}
