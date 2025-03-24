import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IAgentWriter } from '../providers/agent.writer';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { CreateAgent } from '@app/common/streams/agent/create-agent.model';
import { CreateAgentRequest } from '../models/agent/create-agent.model';
import * as uuid from 'uuid';

@Injectable()
export class AgentNatsService
  extends BaseNatsJetstreamService
  implements IAgentWriter
{
  private readonly _logger = new Logger(AgentNatsService.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {
    super();
  }

  get client(): ClientProxy<Record<never, Function>, string> {
    return this.natsClient;
  }

  get logger(): Logger {
    return this._logger;
  }

  get module(): string {
    return 'gateway-service';
  }

  async createAgent(req: CreateAgentRequest): Promise<AgentDto> {
    const res = await this.send<CreateAgent, ApiResponse<AgentDto>>(
      uuid.v4(),
      new CreateAgent({
        email: req.email,
        accountId: req.accountId,
        channelIds: req.channelIds,
        title: req.title,
        password: req.password,
        phone: req.phone,
        firstName: req.firstName,
        role: req.role,
        lastName: req.lastName,
      }),
    );
    if (res.error) throw res.error;

    return res.data;
  }
}
