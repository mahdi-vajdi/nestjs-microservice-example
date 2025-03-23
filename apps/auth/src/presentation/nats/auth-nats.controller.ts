import { Controller } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { ApiResponse, AuthTokensDto } from '@app/common/dto-generic';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ForbiddenAccessError } from '@app/common/errors/forbidden-access.error';
import { NotFoundError } from '@app/common/errors';
import { SignupRequest } from '@app/common/streams/auth/signup.model';
import { SignOutRequest } from '@app/common/streams/auth/signout.model';
import { RefreshTokensRequest } from '@app/common/streams/auth/refresh-tokens.model';
import { SignInRequest } from '@app/common/streams/auth/signin.model';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: new SignupRequest().streamKey() })
  async signup(
    @Payload() signupDto: SignupRequest,
  ): Promise<ApiResponse<AuthTokensDto>> {
    return await this.authService.signup(signupDto);
  }

  @MessagePattern({ cmd: new SignInRequest().streamKey() })
  async signin(
    @Payload() dto: SignInRequest,
  ): Promise<ApiResponse<AuthTokensDto>> {
    try {
      return await this.authService.signin(dto);
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else throw new RpcException(error.message);
    }
  }

  @EventPattern(new SignOutRequest().streamKey())
  signout(
    @Payload() { agentId }: SignOutRequest,
    @Ctx() context: NatsJetStreamContext,
  ): void {
    this.authService.signout(agentId);
    context.message.ack();
  }

  @MessagePattern({ cmd: new RefreshTokensRequest().streamKey() })
  async refresh(
    @Payload() { agentId, refreshToken }: RefreshTokensRequest,
  ): Promise<ApiResponse<AuthTokensDto>> {
    try {
      return await this.authService.refreshTokens(agentId, refreshToken);
    } catch (error) {
      if (error instanceof ForbiddenAccessError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else if (error instanceof NotFoundError)
        throw new RpcException({
          statusCode: 409,
          message: error.message,
        });
      else throw new RpcException(error.message);
    }
  }
}
