import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  AUTH_GRPC_CLIENT,
  AUTH_SERVICE_NAME,
  AuthGrpcService,
} from '@app/contracts';
import type {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '@app/contracts';

@Controller('auth')
export class AuthHttpController implements OnModuleInit {
  private authService!: AuthGrpcService;

  constructor(
    @Inject(AUTH_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.authService = this.client.getService<AuthGrpcService>(AUTH_SERVICE_NAME);
  }

  @Post('login')
  async login(@Body() dto: LoginRequest) {
    return await lastValueFrom(this.authService.login(dto));
  }

  @Post('logout')
  async logout(@Body() dto: LogoutRequest) {
    return await lastValueFrom(this.authService.logout(dto));
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenRequest) {
    return await lastValueFrom(this.authService.refreshToken(dto));
  }
}
