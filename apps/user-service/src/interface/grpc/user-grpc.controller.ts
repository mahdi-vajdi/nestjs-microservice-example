import {
  type CreateUserRequest,
  CreateUserResponse,
  type GetUserByEmailRequest,
  type GetUserRequest,
  GetUserResponse,
} from '@app/contracts';
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user/get-user.query';
import { GetUserByEmailQuery } from '../../application/queries/get-user-by-email/get-user-by-email.query';

@Controller()
export class UserGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    return this.commandBus.execute<CreateUserCommand, CreateUserResponse>(
      new CreateUserCommand(request.email, request.password),
    );
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    return this.queryBus.execute<GetUserQuery, GetUserResponse>(new GetUserQuery(request.id));
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail(request: GetUserByEmailRequest): Promise<GetUserResponse> {
    return this.queryBus.execute<GetUserByEmailQuery, GetUserResponse>(
      new GetUserByEmailQuery(request.email),
    );
  }
}
