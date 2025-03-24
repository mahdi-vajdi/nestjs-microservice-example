import { UpdateRefreshTokenRequest } from '../models/agent/update-refresh-token.model';

export interface IAgentWriter {
  updateRefreshToken(req: UpdateRefreshTokenRequest): Promise<void>;
}

export const AGENT_WRITER = 'agent-writer';
