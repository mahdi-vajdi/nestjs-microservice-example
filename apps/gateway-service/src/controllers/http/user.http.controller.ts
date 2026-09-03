import {
  CreateUserResponse,
  GetUserResponse,
  IDENTITY_SERVICE_NAME,
  IdentityGrpcService,
} from '@app/contracts';
import { Body, Controller, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { CreateUserHttpDto } from './dtos/create-user.http.dto';

@ApiTags('Users')
@Controller('users')
export class UserHttpController implements OnModuleInit {
  private identityService!: IdentityGrpcService;

  constructor(@Inject('IDENTITY_SERVICE') private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.identityService = this.grpcClient.getService<IdentityGrpcService>(IDENTITY_SERVICE_NAME);
  }

  @Post()
  async createUser(@Body() body: CreateUserHttpDto): Promise<CreateUserResponse> {
    return lastValueFrom(
      this.identityService.createUser({
        email: body.email,
        password: body.password,
      }),
    );
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserResponse> {
    return lastValueFrom(this.identityService.getUser({ id }));
  }
}
