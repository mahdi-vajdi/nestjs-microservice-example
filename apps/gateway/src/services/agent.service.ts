import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/agent-grpc.config';
import { CreateAgentRequest } from '@app/common/streams/agent/create-agent.model';

@Injectable()
export class AgentService implements OnModuleInit {
  private agentQueryService: IAgentGrpcService;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService = this.agentGrpcClient.getService<IAgentGrpcService>(
      AGENT_GRPC_SERVICE_NAME,
    );
  }

  createAgent(user: JwtPayloadDto, dto: CreateAgentDto) {
    return this.natsClient.send<ApiResponse<AgentDto | null>>(
      { cmd: new CreateAgentRequest().streamKey() },
      {
        requesterAccountId: user.account,
        ...dto,
      },
    );
  }

  getAccountAgents(user: JwtPayloadDto) {
    return this.agentQueryService.getAccountAgents({
      accountId: user.account,
    });
  }
}
