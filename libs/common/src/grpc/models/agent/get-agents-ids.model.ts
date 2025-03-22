export interface GetAgentsIdsRequest {
  accountId: string;
}

export interface GetAgentIdsResponse {
  agentsIds: string[] | undefined;
}
