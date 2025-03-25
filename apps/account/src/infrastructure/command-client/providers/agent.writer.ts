import { CreateOwnerAgentRequest } from '../models/agent/create-owner-agent.model';
import { AgentDto } from '@app/common/dto-generic';

export interface IAgentWriter {
  createOwnerAgent(req: CreateOwnerAgentRequest): Promise<AgentDto>;
}

export const AGENT_WRITER = 'agent-writer';
