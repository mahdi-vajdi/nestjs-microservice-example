import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { DuplicateError } from '@app/common/errors';
import {
  USER_EVENT_PUBLISHER,
  UserEventPublisher,
} from '../../domain/event-publisher/user-event.publisher';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userProvider: UserRepository,
    @Inject(USER_EVENT_PUBLISHER)
    private readonly userEventClient: UserEventPublisher,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        dto.email,
        dto.mobile,
      );
      if (userExists) {
        throw new DuplicateError(
          `User with email ${dto.email} or phone ${dto.mobile} exists`,
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.userProvider.createUser(
        User.create(
          dto.email,
          dto.mobile,
          dto.firstName,
          dto.lastName,
          hashedPassword,
          dto.avatar,
        ),
      );

      // Publish the user created event
      await this.userEventClient.userCreated(user);

      return user;
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
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
