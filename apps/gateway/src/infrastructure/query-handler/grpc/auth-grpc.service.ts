import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthQueryHandler } from '../../../domain/query/interfaces/auth-query.handler';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GRPC_AUTH_PACKAGE_NAME,
} from '@app/common/grpc/models/auth.proto';

@Injectable()
export class AuthGrpcService implements OnModuleInit, AuthQueryHandler {
  private authGrpcService: AuthServiceClient;

  constructor(
    @Inject(GRPC_AUTH_PACKAGE_NAME) private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService =
      this.grpcClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
}
