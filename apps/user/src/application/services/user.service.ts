import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiResponse, UserDto, UserRole } from '@app/common/dto-generic';
import { GetUserUsersResponse } from '@app/common/grpc/models/user/get-account-users.model';
import { UserExistsResponse } from '@app/common/grpc/models/user/user-exists.model';
import { GetUserIdsResponse } from '@app/common/grpc/models/user/get-user-ids.model';
import { GetUserByIdResponse } from '@app/common/grpc/models/user/get-user-by-id.model';
import { GetUserByEmailResponse } from '@app/common/grpc/models/user/get-user-by-email.model';
import { CreateOwnerUserDto } from './dtos/create-owner-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import { UserModel } from '../../infrastructure/database/mongo/models/user.model';
import {
  IUserProvider,
  USER_PROVIDER,
} from '../../infrastructure/database/providers/user.provider';
import { User } from '../../domain/entities/user.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_PROVIDER) private readonly userProvider: IUserProvider,
  ) {}

  async createOwnerUser(
    dto: CreateOwnerUserDto,
  ): Promise<ApiResponse<UserDto | null>> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        dto.email,
        dto.phone,
      );
      if (userExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The user already exists',
          },
        };

      const user = User.create(
        new Types.ObjectId().toHexString(),
        dto.accountId,
        dto.email,
        dto.phone,
        dto.firstName,
        dto.lastName,
        'Admin',
        await bcrypt.hash(dto.password, 10),
        null,
        UserRole.OWNER,
        'default',
      );
      await this.userProvider.add(user);

      // Get the created user from db
      const createdUser = await this.userProvider.findByEmail(dto.email);

      return {
        success: true,
        data: createdUser ? this.toCommandDto(createdUser) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async createUser(dto: CreateUserDto): Promise<ApiResponse<UserDto | null>> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        dto.email,
        dto.phone,
      );
      if (userExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The user already exists',
          },
        };

      // Create the user
      const user = User.create(
        new Types.ObjectId().toHexString(),
        dto.accountId,
        dto.email,
        dto.phone,
        dto.firstName,
        dto.lastName,
        dto.title,
        await bcrypt.hash(dto.password, 10),
        null,
        UserRole.OWNER,
        'default',
      );
      await this.userProvider.add(user);

      const createdUser = await this.userProvider.findByEmail(dto.email);
      return {
        success: true,
        data: createdUser ? this.toCommandDto(createdUser) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async updateRefreshToken({
    userId,
    newToken,
  }: UpdateRefreshTokenDto): Promise<ApiResponse<null>> {
    try {
      const user = await this.userProvider.findById(userId);
      if (!user) return;

      user.changeRefreshToken(newToken);
      await this.userProvider.save(user);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async getAccountUsers(accountId: string): Promise<GetUserUsersResponse> {
    const users = await this.userProvider.findByAccount(accountId);

    if (users && users.length > 0) {
      return {
        users: users.map((user) => ({
          id: user._id.toHexString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          account: user.account.toHexString(),
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          title: user.title,
          role: UserRole[user.role],
          password: user.password,
          refreshToken: user.refreshToken,
        })),
      };
    } else {
      return undefined;
    }
  }

  async getUserIds(accountId: string): Promise<GetUserIdsResponse> {
    const userIds = await this.userProvider.findIdsByAccount(accountId);
    if (userIds && userIds.length > 0) {
      return {
        userIds: userIds,
      };
    } else return { userIds: undefined };
  }

  async getById(id: string): Promise<GetUserByIdResponse> {
    const user = await this.userProvider.findById(id);

    if (user) {
      return {
        id: user.id,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        account: user.email,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        role: UserRole[user.role],
        password: user.password,
        refreshToken: user.refreshToken,
      };
    } else {
      return undefined;
    }
  }

  async getByEmail(email: string): Promise<GetUserByEmailResponse> {
    const user = await this.userProvider.findByEmail(email);

    if (user) {
      return {
        id: user._id.toHexString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        account: user.account.toHexString(),
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        role: UserRole[user.role],
        password: user.password,
        refreshToken: user.refreshToken,
      };
    } else {
      return undefined;
    }
  }

  async userExists(email: string, phone: string): Promise<UserExistsResponse> {
    const userExists = await this.userProvider.userExists(email, phone);

    if (userExists) {
      return {
        userExists: !!userExists,
      };
    } else return { userExists: undefined };
  }

  private toCommandDto(user: UserModel): UserDto {
    return {
      id: user._id.toHexString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      account: user.account.toHexString(),
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      refreshToken: user.refreshToken,
      role: user.role,
      avatar: user.avatar,
      online: user.online,
    };
  }
}
