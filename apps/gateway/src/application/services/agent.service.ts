import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { CreateAgentDto } from '../../dto/agent/create-agent.dto';
import {
  AGENT_WRITER,
  IAgentWriter,
} from '../../infrastructure/command-client/providers/agent.writer';
import {
  AGENT_READER,
  IAgentReader,
} from '../../infrastructure/query-client/providers/agent.reader';

@Injectable()
export class AgentService {
  constructor(
    @Inject(AGENT_WRITER) private readonly agentWriter: IAgentWriter,
    @Inject(AGENT_READER)
    private readonly agentReader: IAgentReader,
  ) {}

  createAgent(user: JwtPayloadDto, dto: CreateAgentDto) {
    return this.agentWriter.createAgent({
      email: dto.email,
      accountId: user.account,
      channelIds: dto.channelIds,
      title: dto.title,
      password: dto.password,
      phone: dto.phone,
      firstName: dto.firstName,
      role: dto.role,
      lastName: dto.lastName,
    });
  }

  getAccountAgents(user: JwtPayloadDto) {
    return this.agentReader.getAccountAgents(user.account);
  }
}
