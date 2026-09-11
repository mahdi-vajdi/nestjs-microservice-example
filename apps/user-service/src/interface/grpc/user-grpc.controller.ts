import {
  type CreateUserRequest,
  CreateUserResponse,
  type GetUserByEmailRequest,
  type GetUserRequest,
  GetUserResponse,
  UserGrpcService,
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
  async createUser(request: CreateUserRequest): Promise<any> {
    const command = new CreateUserCommand(request.email, request.password);
    return this.commandBus.execute(command);
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(request: GetUserRequest): Promise<any> {
    const query = new GetUserQuery(request.id);
    return this.queryBus.execute(query);
  }

  @GrpcMethod('UserService', 'GetUserByEmail')
  async getUserByEmail(request: GetUserByEmailRequest): Promise<any> {
    const query = new GetUserByEmailQuery(request.email);
    return this.queryBus.execute(query);
  }
}
