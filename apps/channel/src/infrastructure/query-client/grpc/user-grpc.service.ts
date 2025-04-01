import { Inject, Injectable } from '@nestjs/common';
import { IUserGrpcService } from '@app/common/grpc/interfaces/user.interface';
import {
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/user-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IUserReader } from '../providers/user.reader';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserGrpcService implements IUserReader {
  private readonly userGrpcService: IUserGrpcService;

  constructor(
    @Inject(USER_GRPC_CLIENT_PROVIDER)
    userGrpcClient: ClientGrpc,
  ) {
    this.userGrpcService = userGrpcClient.getService<IUserGrpcService>(
      USER_GRPC_SERVICE_NAME,
    );
  }

  async getAccountUserIds(accountId: string): Promise<string[]> {
    try {
      const res = await lastValueFrom(
        await this.userGrpcService.getUserIds({
          accountId: accountId,
        }),
      );
      return res.userIds;
    } catch (error) {
      throw error;
    }
  }
}
