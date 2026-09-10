import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { TokenSessionRepositoryPort } from '../../../domain';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenSessionRepo: TokenSessionRepositoryPort) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.tokenSessionRepo.revoke(command.refreshToken);
  }
}
