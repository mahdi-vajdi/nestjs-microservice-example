import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '@app/contracts';
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';

import { LoginCommand } from '../../application/commands/login/login.command';
import { LogoutCommand } from '../../application/commands/logout/logout.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { ValidateTokenQuery } from '../../application/queries/validate-token/validate-token.query';

@Controller()
export class AuthGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.commandBus.execute(new LoginCommand(data.email, data.password));
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    await this.commandBus.execute(new LogoutCommand(data.refreshToken));
    return { success: true };
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.commandBus.execute(new RefreshTokenCommand(data.refreshToken));
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: ValidateTokenRequest): Promise<ValidateTokenResponse> {
    return this.queryBus.execute(new ValidateTokenQuery(data.accessToken));
  }
}
