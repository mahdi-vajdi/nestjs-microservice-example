import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { GetAccountAgentsResponse } from '@app/common/grpc/models/agent/get-account-agents.model';
import { lastValueFrom } from 'rxjs';
import { IAgentReader } from '../providers/agent.reader';

@Injectable()
export class AgentGrpcService implements OnModuleInit, IAgentReader {
  private agentGrpcService: IAgentGrpcService;

  constructor(
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentGrpcService = this.agentGrpcClient.getService<IAgentGrpcService>(
      AGENT_GRPC_SERVICE_NAME,
    );
  }

  async getAccountAgents(accountId: string): Promise<GetAccountAgentsResponse> {
    return lastValueFrom(
      await this.agentGrpcService.getAccountAgents({
        accountId: accountId,
      }),
    );
  }
}
