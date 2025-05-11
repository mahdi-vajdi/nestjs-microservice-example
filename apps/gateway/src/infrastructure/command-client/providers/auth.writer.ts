import { SignupRequest, SignupResponse } from '../models/auth/signup.model';
import { SigninRequest, SigninResponse } from '../models/auth/signin.model';
import { SignoutRequest } from '../models/auth/signout.model';
import {
  RefreshTokenRequest,
  RefreshTokensResponse,
} from '../models/auth/refresh-token.model';

export interface AuthWriter {
  signup(req: SignupRequest): Promise<SignupResponse>;

  signin(req: SigninRequest): Promise<SigninResponse>;

  signout(req: SignoutRequest): Promise<void>;

  refreshTokens(req: RefreshTokenRequest): Promise<RefreshTokensResponse>;
}

export const AUTH_WRITER = 'auth-writer';
