import { Inject, Injectable } from '@nestjs/common';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IAgentReader } from '../providers/agent.reader';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AgentGrpcService implements IAgentReader {
  private readonly agentGrpcService: IAgentGrpcService;

  constructor(
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    agentGrpcClient: ClientGrpc,
  ) {
    this.agentGrpcService = agentGrpcClient.getService<IAgentGrpcService>(
      AGENT_GRPC_SERVICE_NAME,
    );
  }

  async getAccountAgentIds(accountId: string): Promise<string[]> {
    try {
      const res = await lastValueFrom(
        await this.agentGrpcService.getAgentsIds({
          accountId: accountId,
        }),
      );
      return res.agentsIds;
    } catch (error) {
      throw error;
    }
  }
}
