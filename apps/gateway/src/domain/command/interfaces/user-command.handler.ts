import {
  CreateUserCommandRequest,
  CreateUserCommandResponse,
} from '../commands/user/create-user.model';

export interface UserCommandHandler {
  createUser(req: CreateUserCommandRequest): Promise<CreateUserCommandResponse>;
}

export const USER_COMMAND_HANDLER = 'user-command-handler';
