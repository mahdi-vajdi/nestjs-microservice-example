import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IAgentWriter } from '../providers/agent.writer';
import { UpdateRefreshTokenRequest } from '../models/agent/update-refresh-token.model';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { UpdateRefreshToken } from '@app/common/streams/agent/update-refresh-token.model';
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
    return 'auth-service';
  }

  async updateRefreshToken(req: UpdateRefreshTokenRequest): Promise<void> {
    await this.emit<UpdateRefreshToken>(
      uuid.v4(),
      new UpdateRefreshToken({
        agentId: req.id,
        newToken: req.refreshToken,
      }),
    );
  }
}
