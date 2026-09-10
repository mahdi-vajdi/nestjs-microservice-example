import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort, Email } from '../../../domain';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { NotFoundException } from '@app/common';
import { UserResponseMapper } from '../../mappers/user-response.mapper';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<UserResponseDto> {
    const email = Email.create(query.email);
    const user = await this.userRepository.findByEmail(email.value);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseMapper.toDto(user);
  }
}
