import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdQuery } from '../impl/get-by-id.query';
import { Inject } from '@nestjs/common';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';
import { Agent } from '../../../domain/entities/agent.entity';

@QueryHandler(GetByIdQuery)
export class GetByIdHandler implements IQueryHandler<GetByIdQuery, Agent> {
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute({ agentId }: GetByIdQuery): Promise<Agent> {
    return this.agentProvider.findById(agentId);
  }
}
