import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { AgentQueryRepository } from '../../../infrastructure/repositories/agent.query-repo';
import { AgentModel } from '../../../infrastructure/models/agent.model';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AgentModel | null>
{
  constructor(private readonly agentRepo: AgentQueryRepository) {}

  async execute({ email }: GetByEmailQuery): Promise<AgentModel | null> {
    return this.agentRepo.findByEmail(email);
  }
}
