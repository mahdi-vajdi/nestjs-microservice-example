import { Controller, Logger } from '@nestjs/common';

import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from '../../application/services/user.service';
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
  GetAccountUsersItem,
  GetAccountUsersRequest,
  GetAccountUsersResponse,
} from '@app/common/grpc/models/user/get-account-users.model';
import {
  GetUserIdsRequest,
  GetUserIdsResponse,
} from '@app/common/grpc/models/user/get-user-ids.model';
import {
  GetUserByEmailRequest,
  GetUserByEmailResponse,
} from '@app/common/grpc/models/user/get-user-by-email.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { USER_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/user-grpc.config';
import { Result } from '@app/common/result';

@Controller()
export class UserGrpcController implements IUserGrpcService {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetAccountUsers')
  async getAccountUsers(
    req: GetAccountUsersRequest,
  ): Promise<Observable<GetAccountUsersResponse>> {
    try {
      const users = await this.userService.getAccountUsers(req.accountId);
      return of<GetAccountUsersResponse>({
        users: users.map(
          (user): GetAccountUsersItem => ({
            id: user.id,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            account: user.admin,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.title,
            role: user.role,
            password: user.password,
            refreshToken: user.refreshToken,
          }),
        ),
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.getAccountUsers.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUsersIds')
  async getUserIds(
    req: GetUserIdsRequest,
  ): Promise<Observable<GetUserIdsResponse>> {
    try {
      const userIds = await this.userService.getAccountUsersIds(req.accountId);
      return of<GetUserIdsResponse>({ userIds: userIds });
    } catch (error) {
      this.logger.error(`error in ${this.getUserIds.name}: ${error.message}`);
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
        account: user.admin,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        role: user.role,
        password: user.password,
        refreshToken: user.refreshToken,
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
        account: user.admin,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        role: user.role,
        password: user.password,
        refreshToken: user.refreshToken,
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
