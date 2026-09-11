import { AUTH_GRPC_CLIENT, AUTH_SERVICE_NAME, AuthGrpcService } from '@app/contracts';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService!: AuthGrpcService;

  constructor(
    @Inject(AUTH_GRPC_CLIENT)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthGrpcService>(AUTH_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const response = await lastValueFrom(this.authService.validateToken({ accessToken: token }));

      if (!response.isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      // Attach user info to the request for down-stream use
      request['user'] = {
        userId: response.userId,
        role: response.role,
      };

      return true;
    } catch (_err) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
