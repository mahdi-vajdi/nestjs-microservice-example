import { Types } from 'mongoose';
import { Agent } from '../../../domain/entities/agent.entity';
import { AgentModel } from '../mongo/models/agent.model';

export interface IAgentReader {
  findById(agentId: string): Promise<Agent>;

  findByEmail(email: string): Promise<AgentModel | null>;

  findByAccount(accountId: string): Promise<AgentModel[]>;

  findIdsByAccount(accountId: string): Promise<string[]>;

  agentExists(
    email: string,
    phone: string,
  ): Promise<{
    _id: Types.ObjectId;
  } | null>;
}

export interface IAgentWriter {
  add(entity: Agent): Promise<void>;

  save(entity: Agent): Promise<void>;
}

export interface IAgentProvider extends IAgentReader, IAgentWriter {}

export const AGENT_PROVIDER = 'agent-provider';
