import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from '../commands/impl/create-account.command';
import { GetByEmailQuery } from '../queries/impl/get-by-email.query';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { GetByIdQuery } from '../queries/impl/get-by-id.query';
import { AccountExistsQuery } from '../queries/impl/account-exists.query';
import { GetAccountByIdResponse } from '@app/common/grpc/models/account/get-account-by-id.model';
import { GetAccountByEmailResponse } from '@app/common/grpc/models/account/get-account-by-email.model';
import { AccountExistsResponse } from '@app/common/grpc/models/account/account-exists.model';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccountModel } from '../../infrastructure/database/mongo/models/account.model';
import {
  AGENT_WRITER,
  IAgentWriter,
} from '../../infrastructure/command-client/providers/agent.writer';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(AGENT_WRITER) private readonly agentWriter: IAgentWriter,
  ) {}

  async createAccount(
    dto: CreateAccountDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Create the account entity itself
      await this.commandBus.execute<CreateAccountCommand, void>(
        new CreateAccountCommand(dto.email),
      );

      // Get the newly created account
      const account = await this.queryBus.execute<
        GetByEmailQuery,
        AccountModel | null
      >(new GetByEmailQuery(dto.email));

      if (!account) {
        this.logger.error('Could not find the newly created account', {
          function: 'createAccount',
          input: dto,
        });

        return {
          success: false,
          error: {
            code: 404,
            message: 'Could not find the newly created agent',
          },
        };
      }

      // Create the default agent that owns the account
      const createAgentResult = await this.agentWriter.createOwnerAgent({
        accountId: account._id.toHexString(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        channelId: null, // FIXME: user real channel ID
      });

      if (!createAgentResult) {
        this.logger.error('Could not find the newly created agent', undefined, {
          function: 'createAccount',
          input: dto,
        });

        return {
          success: false,
          error: {
            code: 404,
            message: 'Could not find the newly created agent',
          },
        };
      }

      // Return the created agent. the agent has account ID.
      return {
        success: true,
        data: createAgentResult,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, {
        function: 'createAccount',
        input: dto,
      });

      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async getAccountById(accountId: string): Promise<GetAccountByIdResponse> {
    const account = await this.queryBus.execute<
      GetByIdQuery,
      AccountModel | null
    >(new GetByIdQuery(accountId));

    if (account)
      return {
        id: account._id.toHexString(),
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
        email: account.email,
      };
    else return undefined;
  }

  async getAccountByEmail(email: string): Promise<GetAccountByEmailResponse> {
    const account = await this.queryBus.execute<
      GetByEmailQuery,
      AccountModel | null
    >(new GetByEmailQuery(email));

    if (account)
      return {
        id: account._id.toHexString(),
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
        email: account.email,
      };
    else return undefined;
  }

  async accountExists(email: string): Promise<AccountExistsResponse> {
    const exists = await this.queryBus.execute<AccountExistsQuery, boolean>(
      new AccountExistsQuery(email),
    );

    return { exists };
  }
}
