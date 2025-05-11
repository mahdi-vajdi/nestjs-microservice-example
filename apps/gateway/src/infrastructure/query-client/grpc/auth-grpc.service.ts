import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthReader } from '../providers/auth.reader';
import {
  AUTH_GRPC_CLIENT_PROVIDER,
  AUTH_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/auth-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthGrpcService implements OnModuleInit, AuthReader {
  private authGrpcService: AuthGrpcService;

  constructor(
    @Inject(AUTH_GRPC_CLIENT_PROVIDER) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService = this.client.getService<AuthGrpcService>(
      AUTH_GRPC_SERVICE_NAME,
    );
  }
}
