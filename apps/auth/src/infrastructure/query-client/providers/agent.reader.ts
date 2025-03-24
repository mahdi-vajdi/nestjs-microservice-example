import { GetAgentByEmailResponse } from '@app/common/grpc/models/agent/get-agent-by-email.model';

export interface IAgentReader {
  getAgentByEmail(email: string): Promise<GetAgentByEmailResponse>;

  getAgentById(id: string): Promise<GetAgentByEmailResponse>;
}

export const AGENT_READER = 'agent-reader';
