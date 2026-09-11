import { AUTH_GRPC_CLIENT, AUTH_SERVICE_NAME, AuthGrpcService } from '@app/contracts';
import { Body, Controller, Inject, OnModuleInit, Post, UseGuards } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginHttpDto, LogoutHttpDto, RefreshTokenHttpDto } from './dtos/auth.http.dto';

@ApiTags('Auth')
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
  async login(@Body() dto: LoginHttpDto) {
    return await lastValueFrom(this.authService.login(dto));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() dto: LogoutHttpDto) {
    return await lastValueFrom(this.authService.logout(dto));
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenHttpDto) {
    return await lastValueFrom(this.authService.refreshToken(dto));
  }
}
