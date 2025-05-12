import { Controller, Logger } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { Result } from '@app/common/result';
import { UserService } from '../../../application/services/user.service';
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

@Controller()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private readonly userService: UserService) {}

  async createUser(
    @Payload() dto: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    try {
      const user = await this.userService.createUser({
        email: dto.email,
        mobile: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        avatar: dto.avatar,
      });

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
      const user = await this.userService.getUserById(req.userId);
      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
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
      const user = await this.userService.getUserByEmail(req.userEmail);
      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
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
      const res = await this.userService.userExists(req.email, req.phone);
      return { userExists: res };
    } catch (error) {
      this.logger.error(`error in ${this.userExists.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }
}
