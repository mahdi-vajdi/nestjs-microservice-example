import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IUserWriter } from '../providers/user.writer';
import { UpdateRefreshTokenRequest } from '../models/user/update-refresh-token.model';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { UpdateRefreshToken } from '@app/common/streams/user/update-refresh-token.model';
import * as uuid from 'uuid';

@Injectable()
export class UserNatsService
  extends BaseNatsJetstreamService
  implements IUserWriter
{
  private readonly _logger = new Logger(UserNatsService.name);

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
        userId: req.id,
        newToken: req.refreshToken,
      }),
    );
  }
}
