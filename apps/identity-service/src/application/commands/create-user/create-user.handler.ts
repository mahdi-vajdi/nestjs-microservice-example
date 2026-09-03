import { ConflictException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { Email, Password, User, UserRepositoryPort } from '../../../domain';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const email = Email.create(command.email);
    const password = Password.create(command.password);

    const existingUser = await this.userRepo.findOneByEmail(email.value);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // FIXME: Use a password service
    const passwordHash = await bcrypt.hash(password.value, 10);
    const user = User.create(email, passwordHash);

    await this.userRepo.save(user);

    return user.id;
  }
}
