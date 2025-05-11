import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthReader } from '../providers/auth.reader';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  GRPC_AUTH_PACKAGE_NAME,
} from '@app/common/grpc/models/auth';

@Injectable()
export class AuthGrpcService implements OnModuleInit, AuthReader {
  private authGrpcService: AuthServiceClient;

  constructor(
    @Inject(GRPC_AUTH_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
}
