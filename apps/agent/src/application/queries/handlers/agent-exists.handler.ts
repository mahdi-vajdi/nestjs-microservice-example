import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AgentExistsQuery } from '../impl/agent-exists-query';
import { AgentQueryRepository } from '../../../infrastructure/repositories/agent.query-repo';

@QueryHandler(AgentExistsQuery)
export class AgentExistsHandler
  implements IQueryHandler<AgentExistsQuery, boolean>
{
  constructor(private readonly agentRepo: AgentQueryRepository) {}

  async execute(query: any): Promise<boolean> {
    const exists = await this.agentRepo.agentExists(query.email, query.phone);
    return !!exists;
  }
}
