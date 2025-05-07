import { Injectable, Logger } from '@nestjs/common';
import { NatsJetstreamService } from '@app/common/nats/nats-jetstream.service';
import { IUserWriter } from '../providers/user.writer';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ApiResponse, UserDto } from '@app/common/dto-generic';
import { CreateUser } from '@app/common/streams/user/create-user.model';
import { CreateUserRequest } from '../models/user/create-user.model';
import * as uuid from 'uuid';

@Injectable()
export class UserNatsService
  extends NatsJetstreamService
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
    return 'gateway-service';
  }

  async createUser(req: CreateUserRequest): Promise<UserDto> {
    const res = await this.send<CreateUser, ApiResponse<UserDto>>(
      uuid.v4(),
      new CreateUser({
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
