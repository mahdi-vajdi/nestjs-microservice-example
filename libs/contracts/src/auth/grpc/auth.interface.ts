import { Observable } from 'rxjs';

import { LoginRequest, LoginResponse } from './models/login.model';
import { LogoutRequest, LogoutResponse } from './models/logout.model';
import { RefreshTokenRequest, RefreshTokenResponse } from './models/refresh-token.model';
import { ValidateTokenRequest, ValidateTokenResponse } from './models/validate-token.model';

export interface AuthGrpcService {
  login(data: LoginRequest, metadata?: any): Observable<LoginResponse>;
  logout(data: LogoutRequest, metadata?: any): Observable<LogoutResponse>;
  refreshToken(data: RefreshTokenRequest, metadata?: any): Observable<RefreshTokenResponse>;
  validateToken(data: ValidateTokenRequest, metadata?: any): Observable<ValidateTokenResponse>;
}

export const AUTH_SERVICE_NAME = 'AuthService';
export const AUTH_PACKAGE = 'auth';
export const AUTH_PROTO_PATH = require('node:path').join(__dirname, '../proto/auth.proto');
export const AUTH_GRPC_CLIENT = 'AUTH_GRPC_CLIENT' as const;
