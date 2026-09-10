import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserId } from '../../../domain';
import { GetUserQuery } from './get-user.query';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { NotFoundException } from '@app/common';
import { UserResponseMapper } from '../../mappers/user-response.mapper';

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
