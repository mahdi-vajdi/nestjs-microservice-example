import {
  CreateUserResponse,
  GetUserResponse,
  USER_GRPC_CLIENT,
  USER_SERVICE_NAME,
  UserGrpcService,
} from '@app/contracts';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateUserHttpDto } from './dtos/create-user.http.dto';

@ApiTags('Users')
@Controller('users')
export class UserHttpController implements OnModuleInit {
  private userService!: UserGrpcService;

  constructor(@Inject(USER_GRPC_CLIENT) private readonly grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.grpcClient.getService<UserGrpcService>(USER_SERVICE_NAME);
  }

  @Post()
  async createUser(@Body() body: CreateUserHttpDto): Promise<CreateUserResponse> {
    return lastValueFrom(
      this.userService.createUser({
        email: body.email,
        password: body.password,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<GetUserResponse> {
    return lastValueFrom(this.userService.getUser({ id }));
  }
}
