import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@app/common/dto-generic';
import { CreateOwnerUserDto } from './dtos/create-owner-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import {
  IUserProvider,
  USER_PROVIDER,
} from '../../domain/repositories/user.provider';
import { User } from '../../domain/entities/user.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { DuplicateError } from '@app/common/errors';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_PROVIDER) private readonly userProvider: IUserProvider,
  ) {}

  async createOwnerUser(dto: CreateOwnerUserDto): Promise<User> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        dto.email,
        dto.phone,
      );
      if (userExists) {
        throw new DuplicateError(
          `User with email ${dto.email} or phone ${dto.phone} exists`,
        );
      }

      return await this.userProvider.createUser(
        User.create(
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
        ),
      );
    } catch (error) {
      this.logger.error(
        `error in ${this.createOwnerUser.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        dto.email,
        dto.phone,
      );
      if (userExists) {
        throw new DuplicateError(
          `User with email ${dto.email} or phone ${dto.phone} exists`,
        );
      }

      return await this.userProvider.createUser(
        User.create(
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
        ),
      );
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
      throw error;
    }
  }

  async updateRefreshToken({
    userId,
    newToken,
  }: UpdateRefreshTokenDto): Promise<boolean> {
    try {
      return await this.userProvider.updateUser(userId, {
        refreshToken: newToken,
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.updateRefreshToken.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async getAccountUsers(accountId: string): Promise<User[]> {
    try {
      return await this.userProvider.getUsersByAccountId(accountId);
    } catch (error) {
      this.logger.error(
        `error in ${this.getAccountUsers.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async getAccountUsersIds(accountId: string): Promise<string[]> {
    try {
      return await this.userProvider.getUsersIdsByAccountId(accountId);
    } catch (error) {
      this.logger.error(
        `error in ${this.getAccountUsersIds.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await this.userProvider.getUserById(id);
    } catch (error) {
      this.logger.error(`error in ${this.getUserById.name}: ${error.message}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.userProvider.getUserByEmail(email);
    } catch (error) {
      this.logger.error(
        `error in ${this.getUserByEmail.name}: ${error.message}`,
      );
      throw error;
    }
  }

  async userExists(email: string, phone: string): Promise<boolean> {
    try {
      return await this.userProvider.userExists(email, phone);
    } catch (error) {
      this.logger.error(`error in ${this.userExists.name}: ${error.message}`);
      throw error;
    }
  }
}
