import type { CreateUserRequest, CreateUserResponse } from '@app/contracts';
import type { GetUserRequest, GetUserResponse } from '@app/contracts';
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user/get-user.query';

@Controller()
export class IdentityGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('IdentityService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const id = await this.commandBus.execute(new CreateUserCommand(data.email, data.password));
    return { id };
  }

  @GrpcMethod('IdentityService', 'GetUser')
  async getUser(data: GetUserRequest): Promise<GetUserResponse> {
    return this.queryBus.execute(new GetUserQuery(data.id));
  }
}
