import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AgentModel } from '../../../infrastructure/models/agent.model';
import { AgentQueryRepository } from '../../../infrastructure/repositories/agent.query-repo';
import { GetAccountAgentsQuery } from '../impl/get-account-agents.query';

@QueryHandler(GetAccountAgentsQuery)
export class GetAccountAgentsHandler
  implements IQueryHandler<GetAccountAgentsQuery, AgentModel[]>
{
  constructor(private readonly agentRepo: AgentQueryRepository) {}

  async execute(query: GetAccountAgentsQuery): Promise<AgentModel[]> {
    return await this.agentRepo.findByAccount(query.accountId);
  }
}
