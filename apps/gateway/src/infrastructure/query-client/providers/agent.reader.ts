import { GetAccountAgentsResponse } from '@app/common/grpc/models/agent/get-account-agents.model';

export interface IAgentReader {
  getAccountAgents(accountId: string): Promise<GetAccountAgentsResponse>;
}

export const AGENT_READER = 'agent-reader';
