import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRefreshTokenCommand } from '../impl/update-refresh-token.command';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';

@CommandHandler(UpdateRefreshTokenCommand)
export class UpdateRefreshTokenHandler
  implements ICommandHandler<UpdateRefreshTokenCommand, void>
{
  z;

  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute(command: UpdateRefreshTokenCommand): Promise<void> {
    const agent = await this.agentProvider.findById(command.agentId);
    if (!agent) return;

    agent.changeRefreshToken(command.refreshToken);
    await this.agentProvider.save(agent);
    agent.commit();
  }
}
