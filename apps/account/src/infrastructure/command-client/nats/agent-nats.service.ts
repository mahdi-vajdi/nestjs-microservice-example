import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IAgentWriter } from '../providers/agent.writer';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { CreateOwnerAgent } from '@app/common/streams/agent/create-owner-agent.model';
import * as uuid from 'uuid';
import { CreateOwnerAgentRequest } from '../models/agent/create-owner-agent.model';

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
    return 'account-service';
  }

  async createOwnerAgent(req: CreateOwnerAgentRequest): Promise<AgentDto> {
    const res = await this.send<CreateOwnerAgent, ApiResponse<AgentDto>>(
      uuid.v4(),
      new CreateOwnerAgent({
        accountId: req.accountId,
        channelId: req.channelId,
        email: req.email,
        firstName: req.firstName,
        lastName: req.lastName,
        password: req.password,
        phone: req.phone,
      }),
    );
    if (res.error) throw res.error;

    return res.data;
  }
}
