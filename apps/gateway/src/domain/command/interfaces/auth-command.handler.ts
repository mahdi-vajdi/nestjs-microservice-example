import {
  CreateCredentialCommandRequest,
  CreateCredentialCommandResponse,
} from '../commands/auth/create-credential.command';
import {
  SigninCommandRequest,
  SigninCommandResponse,
} from '../commands/auth/signin.command';
import { SignoutCommandRequest } from '../commands/auth/signout.command';
import {
  RefreshTokenCommandRequest,
  RefreshTokensCommandResponse,
} from '../commands/auth/refresh-token.command';

export interface AuthCommandHandler {
  createCredential(
    req: CreateCredentialCommandRequest,
  ): Promise<CreateCredentialCommandResponse>;

  signin(req: SigninCommandRequest): Promise<SigninCommandResponse>;

  signout(req: SignoutCommandRequest): Promise<void>;

  refreshTokens(
    req: RefreshTokenCommandRequest,
  ): Promise<RefreshTokensCommandResponse>;
}

export const AUTH_COMMAND_HANDLER = 'auth-command-handler';
