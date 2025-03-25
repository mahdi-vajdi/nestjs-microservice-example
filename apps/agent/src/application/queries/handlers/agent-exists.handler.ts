import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AgentExistsQuery } from '../impl/agent-exists-query';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';

@QueryHandler(AgentExistsQuery)
export class AgentExistsHandler
  implements IQueryHandler<AgentExistsQuery, boolean>
{
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute(query: any): Promise<boolean> {
    const exists = await this.agentProvider.agentExists(
      query.email,
      query.phone,
    );
    return !!exists;
  }
}
