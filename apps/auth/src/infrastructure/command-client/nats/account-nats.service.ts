import { Injectable, Logger } from '@nestjs/common';
import { NatsJetstreamService } from '@app/common/nats/nats-jetstream.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateAccountRequest,
  CreateAccountResponse,
} from '../models/account/create-account.model';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import * as uuid from 'uuid';
import { CreateAccount } from '@app/common/streams/account/create-account.model';
import { ApiResponse } from '@app/common/dto-generic';
import { IAccountWriter } from '../providers/account.writer';

@Injectable()
export class AccountNatsService
  extends NatsJetstreamService
  implements IAccountWriter
{
  private readonly _logger = new Logger(AccountNatsService.name);

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
    return 'auth-repository';
  }

  async createAccount(
    req: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    const res = await this.send<
      CreateAccount,
      ApiResponse<CreateAccountResponse>
    >(
      uuid.v4(),
      new CreateAccount({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        phone: req.phone,
        password: req.password,
      }),
    );
    if (res.error) {
      throw res.error;
    }

    return res.data;
  }
}
