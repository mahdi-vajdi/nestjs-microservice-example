export interface AgentExistsRequest {
  email: string;
  phone: string;
}

export interface AgentExistsResponse {
  agentExists: boolean | undefined;
}
