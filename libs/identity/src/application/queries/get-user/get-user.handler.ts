import { UserResponseDto } from '@app/identity/application/dtos/user.response.dto';
import { GetUserQuery } from '@app/identity/application/queries/get-user/get-user.query';
import { UserRepositoryPort } from '@app/identity/domain';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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
