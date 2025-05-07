import { Controller, Logger } from '@nestjs/common';

import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import {
  GetUserByIdRequest,
  GetUserByIdResponse,
} from '@app/common/grpc/models/user/get-user-by-id.model';
import {
  UserExistsRequest,
  UserExistsResponse,
} from '@app/common/grpc/models/user/user-exists.model';
import { IUserGrpcService } from '@app/common/grpc/interfaces/user.interface';
import {
  GetUserByEmailRequest,
  GetUserByEmailResponse,
} from '@app/common/grpc/models/user/get-user-by-email.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { USER_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/user-grpc.config';
import { Result } from '@app/common/result';
import { UserService } from '../../../application/services/user.service';
import {
  CreateUserRequest,
  CreateUserResponse,
} from '@app/common/grpc/models/user/create-user.model';

@Controller()
export class UserGrpcController implements IUserGrpcService {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'CreateUser')
  async createUser(
    @Payload() dto: CreateUserRequest,
  ): Promise<Observable<CreateUserResponse>> {
    try {
      const user = await this.userService.createUser({
        email: dto.email,
        mobile: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: dto.password,
        avatar: dto.avatar,
      });

      return of({
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUserById')
  async getUserById(
    req: GetUserByIdRequest,
  ): Promise<Observable<GetUserByIdResponse>> {
    try {
      const user = await this.userService.getUserById(req.userId);
      return of<GetUserByIdResponse>({
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      });
    } catch (error) {
      this.logger.error(`error in ${this.getUserById.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUserByEmail')
  async getUserByEmail(
    req: GetUserByEmailRequest,
  ): Promise<Observable<GetUserByEmailResponse>> {
    try {
      const user = await this.userService.getUserByEmail(req.userEmail);
      return of<GetUserByEmailResponse>({
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        email: user.email,
        phone: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.getUserByEmail.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'UserExists')
  async userExists(
    req: UserExistsRequest,
  ): Promise<Observable<UserExistsResponse>> {
    try {
      const res = await this.userService.userExists(req.email, req.phone);
      return of({ userExists: res });
    } catch (error) {
      this.logger.error(`error in ${this.userExists.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }
}
