import { Controller } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
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
import { Signup } from '@app/common/streams/auth/signup.model';
import { SignOut } from '@app/common/streams/auth/signout.model';
import { RefreshTokens } from '@app/common/streams/auth/refresh-tokens.model';
import { SignIn } from '@app/common/streams/auth/signin.model';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: new Signup().streamKey() })
  async signup(
    @Payload() signupDto: Signup,
  ): Promise<ApiResponse<AuthTokensDto>> {
    return await this.authService.signup(signupDto);
  }

  @MessagePattern({ cmd: new SignIn().streamKey() })
  async signin(@Payload() dto: SignIn): Promise<ApiResponse<AuthTokensDto>> {
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

  @EventPattern(new SignOut().streamKey())
  async signout(
    @Payload() { userId }: SignOut,
    @Ctx() context: NatsJetStreamContext,
  ): Promise<void> {
    await this.authService.signout(userId);
    context.message.ack();
  }

  @MessagePattern({ cmd: new RefreshTokens().streamKey() })
  async refresh(
    @Payload() { userId, refreshToken }: RefreshTokens,
  ): Promise<ApiResponse<AuthTokensDto>> {
    try {
      return await this.authService.refreshTokens(userId, refreshToken);
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
