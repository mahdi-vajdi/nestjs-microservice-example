import { Inject, Injectable } from '@nestjs/common';
import { IAccountGrpcService } from '@app/common/grpc/interfaces/account.interface';
import {
  ACCOUNT_GRPC_CLIENT_PROVIDER,
  ACCOUNT_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/account-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IAccountReader } from '../providers/account.reader';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountGrpcService implements IAccountReader {
  private accountGrpcService: IAccountGrpcService;

  constructor(
    @Inject(ACCOUNT_GRPC_CLIENT_PROVIDER)
    accountGrpcClient: ClientGrpc,
  ) {
    this.accountGrpcService = accountGrpcClient.getService<IAccountGrpcService>(
      ACCOUNT_GRPC_SERVICE_NAME,
    );
  }

  async accountExists(email: string): Promise<boolean> {
    try {
      const res = await lastValueFrom(
        await this.accountGrpcService.accountExists({
          email: email,
        }),
      );
      return res.exists;
    } catch (error) {
      throw error;
    }
  }
}
