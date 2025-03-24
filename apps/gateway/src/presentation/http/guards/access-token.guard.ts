import { AgentRole } from '@app/common/dto-generic';
import { ROLES_DECORATOR_KEY } from '@app/common/decorators';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VerifyAccessTokenResponse } from '@app/common/grpc/models/auth/auth-access.dto';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the access token and see if it's not null
    const accessToken =
      context.switchToHttp().getRequest().cookies?.access_token || null;
    if (!accessToken) return false;

    const roles = this.reflector.get<AgentRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    let verifyRes: VerifyAccessTokenResponse;
    try {
      verifyRes = await this.authService.verifyAccessToken(accessToken);
    } catch (error) {
      this.logger.error(error);
      return false;
    }

    if (roles && !roles.includes(AgentRole[verifyRes.role])) {
      throw new ForbiddenException(
        'The agent does not have the authorization to perform this action',
      );
    }
    context.switchToHttp().getRequest().user = verifyRes;
    return true;
  }
}
