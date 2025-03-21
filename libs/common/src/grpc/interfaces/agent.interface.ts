import { Observable } from 'rxjs';
import {
  GetAccountAgentsRequest,
  GetAccountAgentsResponse,
} from '@app/common/grpc/models/agent/get-account-agents.model';
import { GetAgentIdsResponse, GetAgentsIdsRequest } from '@app/common/grpc/models/agent/get-agents-ids.model';
import { GetAgentByIdRequest, GetAgentByIdResponse } from '@app/common/grpc/models/agent/get-agent-by-id.model';
import {
  GetAgentByEmailRequest,
  GetAgentByEmailResponse,
} from '@app/common/grpc/models/agent/get-agent-by-email.model';
import { AgentExistsRequest, AgentExistsResponse } from '@app/common/grpc/models/agent/agents.exists.model';

export interface IAgentGrpcService {
  getAccountAgents(
    req: GetAccountAgentsRequest,
  ): Promise<Observable<GetAccountAgentsResponse>>;

  getAgentsIds(
    req: GetAgentsIdsRequest,
  ): Promise<Observable<GetAgentIdsResponse>>;

  getAgentById(
    req: GetAgentByIdRequest,
  ): Promise<Observable<GetAgentByIdResponse>>;

  getAgentByEmail(
    req: GetAgentByEmailRequest,
  ): Promise<Observable<GetAgentByEmailResponse>>;

  agentExists(
    req: AgentExistsRequest,
  ): Promise<Observable<AgentExistsResponse>>;
}
