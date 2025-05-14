import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GRPC_USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common/grpc/models/user.proto';
import {
  CreateUserCommandRequest,
  CreateUserCommandResponse,
} from '../../../domain/command/commands/user/create-user.model';
import { lastValueFrom } from 'rxjs';
import { UserCommandHandler } from '../../../domain/command/interfaces/user-command.handler';

@Injectable()
export class UserGrpcService implements OnModuleInit, UserCommandHandler {
  private userGrpcService: UserServiceClient;

  constructor(
    @Inject(GRPC_USER_PACKAGE_NAME)
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService =
      this.grpcClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createUser(
    req: CreateUserCommandRequest,
  ): Promise<CreateUserCommandResponse> {
    const res = await lastValueFrom(
      this.userGrpcService.createUser({
        email: req.email,
        phone: req.phone,
        firstName: req.firstName,
        lastName: req.lastName,
        avatar: req.avatar,
      }),
    );

    return {
      id: res.id,
      createdAt: new Date(res.createdAt),
      updatedAt: new Date(res.updatedAt),
    };
  }
}
