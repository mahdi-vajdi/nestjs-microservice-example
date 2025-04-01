import { Controller, Logger } from '@nestjs/common';

import { GrpcMethod } from '@nestjs/microservices';
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
  GetUserUsersRequest,
  GetUserUsersResponse,
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
import { of } from 'rxjs/internal/observable/of';
import { USER_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/user-grpc.config';

@Controller()
export class UserGrpcController implements IUserGrpcService {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetAccountUsers')
  async getAccountUsers(
    req: GetUserUsersRequest,
  ): Promise<Observable<GetUserUsersResponse>> {
    return of(await this.userService.getAccountUsers(req.accountId));
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUsersIds')
  async getUserIds(
    req: GetUserIdsRequest,
  ): Promise<Observable<GetUserIdsResponse>> {
    return of(await this.userService.getUserIds(req.accountId));
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUserById')
  async getUserById(
    req: GetUserByIdRequest,
  ): Promise<Observable<GetUserByIdResponse>> {
    return of(await this.userService.getById(req.userId));
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'GetUserByEmail')
  async getUserByEmail(
    req: GetUserByEmailRequest,
  ): Promise<Observable<GetUserByEmailResponse>> {
    return of(await this.userService.getByEmail(req.userEmail));
  }

  @GrpcMethod(USER_GRPC_SERVICE_NAME, 'UserExists')
  async userExists(
    req: UserExistsRequest,
  ): Promise<Observable<UserExistsResponse>> {
    const res = await this.userService.userExists(req.email, req.phone);
    return of(res);
  }
}
