import { Controller, Logger } from '@nestjs/common';

import { GrpcMethod } from '@nestjs/microservices';
import { AgentService } from '../../application/services/agent.service';
import {
  GetAgentByIdRequest,
  GetAgentByIdResponse,
} from '@app/common/grpc/models/agent/get-agent-by-id.model';
import {
  AgentExistsRequest,
  AgentExistsResponse,
} from '@app/common/grpc/models/agent/agents.exists.model';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import {
  GetAccountAgentsRequest,
  GetAccountAgentsResponse,
} from '@app/common/grpc/models/agent/get-account-agents.model';
import {
  GetAgentIdsResponse,
  GetAgentsIdsRequest,
} from '@app/common/grpc/models/agent/get-agents-ids.model';
import {
  GetAgentByEmailRequest,
  GetAgentByEmailResponse,
} from '@app/common/grpc/models/agent/get-agent-by-email.model';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AGENT_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/agent-grpc.config';

@Controller()
export class AgentGrpcController implements IAgentGrpcService {
  private readonly logger = new Logger(AgentGrpcController.name);

  constructor(private readonly agentService: AgentService) {}

  @GrpcMethod(AGENT_GRPC_SERVICE_NAME, 'GetAccountAgents')
  async getAccountAgents(
    req: GetAccountAgentsRequest,
  ): Promise<Observable<GetAccountAgentsResponse>> {
    return of(await this.agentService.getAccountAgents(req.accountId));
  }

  @GrpcMethod(AGENT_GRPC_SERVICE_NAME, 'GetAgentsIds')
  async getAgentsIds(
    req: GetAgentsIdsRequest,
  ): Promise<Observable<GetAgentIdsResponse>> {
    return of(await this.agentService.getAgentsIds(req.accountId));
  }

  @GrpcMethod(AGENT_GRPC_SERVICE_NAME, 'GetAgentById')
  async getAgentById(
    req: GetAgentByIdRequest,
  ): Promise<Observable<GetAgentByIdResponse>> {
    return of(await this.agentService.getById(req.agentId));
  }

  @GrpcMethod(AGENT_GRPC_SERVICE_NAME, 'GetAgentByEmail')
  async getAgentByEmail(
    req: GetAgentByEmailRequest,
  ): Promise<Observable<GetAgentByEmailResponse>> {
    return of(await this.agentService.getByEmail(req.agentEmail));
  }

  @GrpcMethod(AGENT_GRPC_SERVICE_NAME, 'AgentExists')
  async agentExists(
    req: AgentExistsRequest,
  ): Promise<Observable<AgentExistsResponse>> {
    const res = await this.agentService.agentExists(req.email, req.phone);
    return of(res);
  }
}
