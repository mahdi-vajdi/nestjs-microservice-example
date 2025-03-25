import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountAgentsIdsQuery } from '../impl/get-account-agents-ids.query';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';

@QueryHandler(GetAccountAgentsIdsQuery)
export class GetAccountAgentsIdsHandler
  implements IQueryHandler<GetAccountAgentsIdsQuery, string[]>
{
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute(query: GetAccountAgentsIdsQuery): Promise<string[]> {
    return await this.agentProvider.findIdsByAccount(query.accountId);
  }
}
