import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { User } from '../../entities/user.entity';
import { Inject, Logger } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../ports/repositories/user-repository.interface';
import { DuplicateError } from '@app/common/errors';
import { UserCreatedEvent } from '../../events/impl/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userProvider: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    try {
      // Check if the user already exists
      const userExists = await this.userProvider.userExists(
        command.email,
        command.mobile,
      );
      if (userExists) {
        throw new DuplicateError(
          `User with email ${command.email} or phone ${command.mobile} exists`,
        );
      }

      const user = await this.userProvider.createUser(
        User.create(
          command.email,
          command.mobile,
          command.firstName,
          command.lastName,
          command.avatar,
        ),
      );

      // Publish the user created event
      await this.eventBus.publish(new UserCreatedEvent(user));

      return user;
    } catch (error) {
      this.logger.error(`failed to create user: ${error.message}`);
      throw error;
    }
  }
}
