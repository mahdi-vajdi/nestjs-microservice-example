import { CreatePasswordCredentialsHandler } from './handlers/create-possword-credentials.handler';
import { RefreshTokensHandler } from './handlers/refresh-tokens.handler';
import { SignoutHandler } from './handlers/signout.handler';

export const commandHandlers = [
  CreatePasswordCredentialsHandler,
  SignoutHandler,
  RefreshTokensHandler,
  SignoutHandler,
];
