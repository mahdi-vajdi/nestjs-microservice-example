import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TokenSessionRepositoryPort } from '../../../domain';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenSessionRepo: TokenSessionRepositoryPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.tokenSessionRepo.revoke(command.refreshToken);
  }
}
