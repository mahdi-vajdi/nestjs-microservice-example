import { ConflictException } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { User, UserRepositoryPort } from '../../../domain';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const { email, password } = command;

    const existingUser = await this.userRepo.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // FIXME: Use a password service
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create(email, passwordHash);

    await this.userRepo.save(user);

    return user.id;
  }
}
