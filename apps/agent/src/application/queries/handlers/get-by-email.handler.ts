import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByEmailQuery } from '../impl/get-by-email.query';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';
import { AgentModel } from '../../../infrastructure/database/mongo/models/agent.model';

@QueryHandler(GetByEmailQuery)
export class GetByEmailHandler
  implements IQueryHandler<GetByEmailQuery, AgentModel | null>
{
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute({ email }: GetByEmailQuery): Promise<AgentModel | null> {
    return this.agentProvider.findByEmail(email);
  }
}
