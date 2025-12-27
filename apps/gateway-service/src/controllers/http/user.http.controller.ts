import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  IDENTITY_SERVICE_NAME,
  IdentityGrpcService,
} from '@app/shared';
import { Body, Controller, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('users')
export class UserHttpController implements OnModuleInit {
  private identityService: IdentityGrpcService;

  constructor(@Inject('IDENTITY_SERVICE') private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.identityService = this.grpcClient.getService<IdentityGrpcService>(IDENTITY_SERVICE_NAME);
  }

  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    return lastValueFrom(this.identityService.createUser(body));
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserResponse> {
    return lastValueFrom(this.identityService.getUser({ id }));
  }
}
