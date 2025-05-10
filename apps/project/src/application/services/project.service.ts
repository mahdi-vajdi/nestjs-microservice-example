import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiResponse, UserDto } from '@app/common/dto-generic';
import { GetAccountByIdResponse } from '@app/common/grpc/models/account/get-account-by-id.model';
import { GetAccountByEmailResponse } from '@app/common/grpc/models/account/get-account-by-email.model';
import { AccountExistsResponse } from '@app/common/grpc/models/account/account-exists.model';
import { CreateAccountDto } from './dtos/create-account.dto';
import {
  IUserWriter,
  USER_WRITER,
} from '../../infrastructure/command-client/providers/user.writer';
import {
  IProjectProvider,
  PROJECT_PROVIDER,
} from '../../infrastructure/database/providers/project.provider';
import { Project } from '../../domain/entities/project.entity';
import { Types } from 'mongoose';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(USER_WRITER) private readonly userWriter: IUserWriter,
    @Inject(PROJECT_PROVIDER)
    private readonly accountProvider: IProjectProvider,
  ) {}

  async createAccount(
    dto: CreateAccountDto,
  ): Promise<ApiResponse<UserDto | null>> {
    try {
      // Create the account entity itself
      await this.accountProvider.add(
        Project.create(new Types.ObjectId().toHexString(), dto.email),
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
            message: 'Could not find the newly created user',
          },
        };
      }

      // Create the default user that owns the account
      const createUser = await this.userWriter.createOwnerUser({
        accountId: account._id.toHexString(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        channelId: null, // FIXME: user real channel ID
      });

      if (!createUser) {
        this.logger.error('Could not find the newly created user', undefined, {
          function: 'createAccount',
          input: dto,
        });

        return {
          success: false,
          error: {
            code: 404,
            message: 'Could not find the newly created user',
          },
        };
      }

      // Return the created user. The user has account ID.
      return {
        success: true,
        data: createUser,
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
