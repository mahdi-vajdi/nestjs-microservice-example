import { CreateAgentRequest } from '../models/agent/create-agent.model';
import { AgentDto } from '@app/common/dto-generic';

export interface IAgentWriter {
  createAgent(req: CreateAgentRequest): Promise<AgentDto>;
}

export const AGENT_WRITER = 'agent-writer';
