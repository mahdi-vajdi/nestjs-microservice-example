export interface IAgentReader {
  getAccountAgentIds(accountId: string): Promise<string[]>;
}

export const AGENT_READER = 'agent-reader';
