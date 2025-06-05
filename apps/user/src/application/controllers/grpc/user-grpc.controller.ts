import { Controller, Logger } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { Result } from '@app/common/result';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserByEmailRequest,
  GetUserByEmailResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UserExistsRequest,
  UserExistsResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@app/common/grpc/models/user.proto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../domain/commands/impl/create-user.command';
import { GetUserByIdQuery } from '../../../domain/queries/impl/get-user-by-id.query';
import { GetUserByEmailQuery } from '../../../domain/queries/impl/get-user-by-email.query';
import { UserExistsQuery } from '../../../domain/queries/impl/user-exists.query';

@Controller()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createUser(
    @Payload() dto: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    try {
      const user = await this.commandBus.execute(
        new CreateUserCommand(
          dto.email,
          dto.phone,
          dto.firstName,
          dto.lastName,
          dto.avatar,
        ),
      );

      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }

  async getUserById(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    try {
      const user = await this.queryBus.execute(
        new GetUserByIdQuery(req.userId),
      );

      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      this.logger.error(`error in ${this.getUserById.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }

  async getUserByEmail(
    req: GetUserByEmailRequest,
  ): Promise<GetUserByEmailResponse> {
    try {
      const user = await this.queryBus.execute(
        new GetUserByEmailQuery(req.userEmail),
      );

      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      this.logger.error(
        `error in ${this.getUserByEmail.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  async userExists(req: UserExistsRequest): Promise<UserExistsResponse> {
    try {
      const res = await this.queryBus.execute(
        new UserExistsQuery(req.email, req.phone),
      );

      return { userExists: res };
    } catch (error) {
      this.logger.error(`error in ${this.userExists.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }
}
