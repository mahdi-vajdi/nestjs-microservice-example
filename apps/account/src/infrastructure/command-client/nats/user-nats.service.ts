import { Injectable, Logger } from '@nestjs/common';
import { BaseNatsJetstreamService } from '@app/common/nats/base-nats-jetstream.service';
import { IUserWriter } from '../providers/user.writer';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ApiResponse, UserDto } from '@app/common/dto-generic';
import { CreateOwnerUser } from '@app/common/streams/user/create-owner-user.model';
import * as uuid from 'uuid';
import { CreateOwnerUserRequest } from '../models/user/create-owner-user.model';

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
    return 'account-service';
  }

  async createOwnerUser(req: CreateOwnerUserRequest): Promise<UserDto> {
    const res = await this.send<CreateOwnerUser, ApiResponse<UserDto>>(
      uuid.v4(),
      new CreateOwnerUser({
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
