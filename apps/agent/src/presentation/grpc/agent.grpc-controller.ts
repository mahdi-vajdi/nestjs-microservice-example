import { Controller, Logger } from '@nestjs/common';

import { GrpcMethod } from '@nestjs/microservices';
import { AgentService } from '../../Application/services/agent.service';
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

@Controller()
export class AgentGrpcController implements IAgentGrpcService {
  private readonly logger = new Logger(AgentGrpcController.name);

  constructor(private readonly agentService: AgentService) {}

  @GrpcMethod('AgentService', 'GetAccountAgents')
  async getAccountAgents(
    req: GetAccountAgentsRequest,
  ): Promise<Observable<GetAccountAgentsResponse>> {
    return of(await this.agentService.getAccountAgents(req.accountId));
  }

  @GrpcMethod('AgentService', 'GetAgentsIds')
  async getAgentsIds(
    req: GetAgentsIdsRequest,
  ): Promise<Observable<GetAgentIdsResponse>> {
    return of(await this.agentService.getAgentsIds(req.accountId));
  }

  @GrpcMethod('AgentService', 'GetAgentById')
  async getAgentById(
    req: GetAgentByIdRequest,
  ): Promise<Observable<GetAgentByIdResponse>> {
    return of(await this.agentService.getById(req.agentId));
  }

  @GrpcMethod('AgentService', 'GetAgentByEmail')
  async getAgentByEmail(
    req: GetAgentByEmailRequest,
  ): Promise<Observable<GetAgentByEmailResponse>> {
    return of(await this.agentService.getByEmail(req.agentEmail));
  }

  @GrpcMethod('AgentService', 'AgentExists')
  async agentExists(
    req: AgentExistsRequest,
  ): Promise<Observable<AgentExistsResponse>> {
    const res = await this.agentService.agentExists(req.email, req.phone);
    this.logger.log(`checking agent: ${res}`);

    return of(res);
  }
}
