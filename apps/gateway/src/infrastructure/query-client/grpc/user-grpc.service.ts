import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IUserGrpcService } from '@app/common/grpc/interfaces/user.interface';
import {
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/user-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { GetUserUsersResponse } from '@app/common/grpc/models/user/get-account-users.model';
import { lastValueFrom } from 'rxjs';
import { IUserReader } from '../providers/user.reader';

@Injectable()
export class UserGrpcService implements OnModuleInit, IUserReader {
  private userGrpcService: IUserGrpcService;

  constructor(
    @Inject(USER_GRPC_CLIENT_PROVIDER)
    private readonly userGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService = this.userGrpcClient.getService<IUserGrpcService>(
      USER_GRPC_SERVICE_NAME,
    );
  }

  async getAccountUsers(accountId: string): Promise<GetUserUsersResponse> {
    return lastValueFrom(
      await this.userGrpcService.getAccountUsers({
        accountId: accountId,
      }),
    );
  }
}
