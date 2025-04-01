import { UserRole } from '@app/common/dto-generic';
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
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the refresh token and see if it's not null
    const refreshToken =
      context.switchToHttp().getRequest().cookies?.refresh_token || null;
    if (!refreshToken) return false;

    const roles = this.reflector.get<UserRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    let verifyRes: VerifyAccessTokenResponse;
    try {
      verifyRes = await this.authService.verifyRefreshToken(refreshToken);
    } catch (error) {
      this.logger.error(error);
      return false;
    }

    if (roles && !roles.includes(UserRole[verifyRes.role])) {
      throw new ForbiddenException(
        'The user does not have the authorization to perform this action',
      );
    }
    context.switchToHttp().getRequest().user = verifyRes;
    return true;
  }
}
