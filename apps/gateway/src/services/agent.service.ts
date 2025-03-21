import { ApiResponse } from '@app/common/dto-generic';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { CreateAgentDto } from '../dto/agent/create-agent.dto';
import { AgentDto, AgentSubjects } from '@app/common/dto-command';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import { AGENT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/agent.options';

@Injectable()
export class AgentService implements OnModuleInit {
  private agentQueryService: IAgentGrpcService;

  constructor(
    private readonly natsClient: NatsJetStreamClientProxy,
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<IAgentGrpcService>('AgentService');
  }

  createAgent(user: JwtPayloadDto, dto: CreateAgentDto) {
    return this.natsClient.send<ApiResponse<AgentDto | null>>(
      { cmd: AgentSubjects.CREATE_AGENT },
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
