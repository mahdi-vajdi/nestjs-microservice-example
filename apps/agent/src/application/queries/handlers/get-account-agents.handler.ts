import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountAgentsQuery } from '../impl/get-account-agents.query';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';
import { AgentModel } from '../../../infrastructure/database/mongo/models/agent.model';

@QueryHandler(GetAccountAgentsQuery)
export class GetAccountAgentsHandler
  implements IQueryHandler<GetAccountAgentsQuery, AgentModel[]>
{
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute(query: GetAccountAgentsQuery): Promise<AgentModel[]> {
    return await this.agentProvider.findByAccount(query.accountId);
  }
}
