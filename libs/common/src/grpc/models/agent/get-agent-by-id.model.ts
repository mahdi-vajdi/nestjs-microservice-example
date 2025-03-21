export interface GetAgentByIdRequest {
  agentId: string;
}

export interface GetAgentByIdResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  role: string;
  password: string;
  refreshToken: string | null;
}
