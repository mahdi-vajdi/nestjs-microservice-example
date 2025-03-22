import { AgentRole } from '@app/common/dto-generic';
import { ROLES_DECORATOR_KEY } from '@app/common/decorators';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { IAuthGrpcService } from '@app/common/grpc/interfaces/auth.interface';
import { lastValueFrom } from 'rxjs';
import {
  AUTH_GRPC_CLIENT_PROVIDER,
  AUTH_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/auth-grpc.config';

@Injectable()
export class RefreshTokenGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  private authService: IAuthGrpcService;

  constructor(
    @Inject(AUTH_GRPC_CLIENT_PROVIDER) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<IAuthGrpcService>(
      AUTH_GRPC_SERVICE_NAME,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the refresh token ans see if it's not null
    const refreshToken =
      context.switchToHttp().getRequest().cookies?.refresh_token || null;
    if (!refreshToken) return false;

    const roles = this.reflector.get<AgentRole[]>(
      ROLES_DECORATOR_KEY,
      context.getHandler(),
    );

    const verifyRes$ = await this.authService.verifyRefreshToken({
      refreshToken,
    });

    return await lastValueFrom(
      verifyRes$.pipe(
        tap((jwtPayload) => {
          // Get the method required method roles and see if user has them
          if (
            roles &&
            !roles.map((role) => role.toString()).includes(jwtPayload.role)
          ) {
            throw new ForbiddenException(
              'The agent does not have the authorization to perform this action',
            );
          }

          context.switchToHttp().getRequest().user = jwtPayload;
        }),
        map(() => true),
        catchError((error) => {
          this.logger.error(error);
          return of(false);
        }),
      ),
    );
  }
}
