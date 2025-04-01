import { Inject, Injectable } from '@nestjs/common';
import {
  USER_GRPC_CLIENT_PROVIDER,
  USER_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/user-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IUserGrpcService } from '@app/common/grpc/interfaces/user.interface';
import { IUserReader } from '../providers/user.reader';
import { lastValueFrom } from 'rxjs';
import { GetUserByEmailResponse } from '@app/common/grpc/models/user/get-user-by-email.model';

@Injectable()
export class UserGrpcService implements IUserReader {
  private userGrpcService: IUserGrpcService;

  constructor(
    @Inject(USER_GRPC_CLIENT_PROVIDER)
    userGrpcClient: ClientGrpc,
  ) {
    this.userGrpcService = userGrpcClient.getService<IUserGrpcService>(
      USER_GRPC_SERVICE_NAME,
    );
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailResponse> {
    try {
      return lastValueFrom(
        await this.userGrpcService.getUserByEmail({
          userEmail: email,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<GetUserByEmailResponse> {
    try {
      return lastValueFrom(
        await this.userGrpcService.getUserById({
          userId: id,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
