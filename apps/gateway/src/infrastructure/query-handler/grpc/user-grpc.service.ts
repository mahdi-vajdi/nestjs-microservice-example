import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserQueryHandler } from '../../../domain/query/interfaces/user-query.handler';
import {
  GRPC_USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common/grpc/models/user.proto';
import { lastValueFrom } from 'rxjs';
import { GetUserByIdQueryResponse } from '../../../domain/query/queries/user/get-user-by-id.query';
import { GetUserByEmailQueryResponse } from '../../../domain/query/queries/user/get-user-by-email.query';

@Injectable()
export class UserGrpcService implements OnModuleInit, UserQueryHandler {
  private userGrpcService: UserServiceClient;

  constructor(
    @Inject(GRPC_USER_PACKAGE_NAME)
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService =
      this.grpcClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async getUserById(id: string): Promise<GetUserByIdQueryResponse> {
    const res = await lastValueFrom(
      this.userGrpcService.getUserById({
        userId: id,
      }),
    );

    return {
      id: res.id,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      email: res.email,
      phone: res.phone,
      firstName: res.firstName,
      lastName: res.lastName,
    };
  }

  async getUserByEmail(email: string): Promise<GetUserByEmailQueryResponse> {
    const res = await lastValueFrom(
      this.userGrpcService.getUserByEmail({
        userEmail: email,
      }),
    );

    return {
      id: res.id,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      email: res.email,
      phone: res.phone,
      firstName: res.firstName,
      lastName: res.lastName,
    };
  }
}
