import { Inject, Injectable } from '@nestjs/common';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import { IAgentReader } from '../providers/agent.reader';
import { lastValueFrom } from 'rxjs';
import { GetAgentByEmailResponse } from '@app/common/grpc/models/agent/get-agent-by-email.model';

@Injectable()
export class AgentGrpcService implements IAgentReader {
  private agentGrpcService: IAgentGrpcService;

  constructor(
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    agentGrpcClient: ClientGrpc,
  ) {
    this.agentGrpcService = agentGrpcClient.getService<IAgentGrpcService>(
      AGENT_GRPC_SERVICE_NAME,
    );
  }

  async getAgentByEmail(email: string): Promise<GetAgentByEmailResponse> {
    try {
      return lastValueFrom(
        await this.agentGrpcService.getAgentByEmail({
          agentEmail: email,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async getAgentById(id: string): Promise<GetAgentByEmailResponse> {
    try {
      return lastValueFrom(
        await this.agentGrpcService.getAgentById({
          agentId: id,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
