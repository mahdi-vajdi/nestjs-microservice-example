import { NotFoundException } from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Email, UserRepositoryPort } from '../../../domain';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserResponseMapper } from '../../mappers/user-response.mapper';
import { GetUserByEmailQuery } from './get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(query: GetUserByEmailQuery): Promise<UserResponseDto> {
    const email = Email.create(query.email);
    const user = await this.userRepository.findByEmail(email.value);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseMapper.toDto(user);
  }
}
