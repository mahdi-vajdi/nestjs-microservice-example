import { Inject, Injectable, Logger } from '@nestjs/common';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { GetAccountByIdResponse } from '@app/common/grpc/models/account/get-account-by-id.model';
import { GetAccountByEmailResponse } from '@app/common/grpc/models/account/get-account-by-email.model';
import { AccountExistsResponse } from '@app/common/grpc/models/account/account-exists.model';
import { CreateAccountDto } from './dtos/create-account.dto';
import {
  AGENT_WRITER,
  IAgentWriter,
} from '../../infrastructure/command-client/providers/agent.writer';
import {
  ACCOUNT_PROVIDER,
  IAccountProvider,
} from '../../infrastructure/database/providers/account.provider';
import { Account } from '../../domain/entities/account.entity';
import { Types } from 'mongoose';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @Inject(AGENT_WRITER) private readonly agentWriter: IAgentWriter,
    @Inject(ACCOUNT_PROVIDER)
    private readonly accountProvider: IAccountProvider,
  ) {}

  async createAccount(
    dto: CreateAccountDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Create the account entity itself
      await this.accountProvider.add(
        Account.create(new Types.ObjectId().toHexString(), dto.email),
      );

      // Get the newly created account
      const account = await this.accountProvider.findOneByEmail(dto.email);
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

      // Return the created agent. The agent has account ID.
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
    const account = await this.accountProvider.findOneById(accountId);

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
    const account = await this.accountProvider.findOneByEmail(email);

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
    const account = await this.accountProvider.findOneByEmail(email);

    return { exists: Boolean(account) };
  }
}
