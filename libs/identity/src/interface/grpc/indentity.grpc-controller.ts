import { CreateUserCommand } from '@app/identity/application/commands/create-user/create-user.command';
import { GetUserQuery } from '@app/identity/application/queries/get-user/get-user.query';
import type {
  CreateUserRequest,
  CreateUserResponse,
} from '@app/shared/contracts/grpc/identity/models/create-user.model';
import type {
  GetUserRequest,
  GetUserResponse,
} from '@app/shared/contracts/grpc/identity/models/get-user.model';
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';

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
