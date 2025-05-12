import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserReader } from '../providers/user.reader';
import { GRPC_AUTH_PACKAGE_NAME } from '@app/common/grpc/models/auth.proto';
import { USER_SERVICE_NAME } from '@app/common/grpc/models/user.proto';

@Injectable()
export class UserGrpcService implements OnModuleInit, UserReader {
  private userGrpcService: UserGrpcService;

  constructor(
    @Inject(GRPC_AUTH_PACKAGE_NAME)
    private readonly userGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService =
      this.userGrpcClient.getService<UserGrpcService>(USER_SERVICE_NAME);
  }
}
