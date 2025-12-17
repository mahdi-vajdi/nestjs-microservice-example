import { CreateUserCommand } from '@app/identity/application/commands/create-user/create-user.command';
import { User, UserRepositoryPort } from '@app/identity/domain/src';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { email, password } = command;

    const existingUser = await this.userRepo.findOneByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // FIXME: Use a password service
    const passwordHash = await bcrypt.hash(password, 10);

    const user = User.create(email, passwordHash);

    await this.userRepo.save(user);

    return user.id;
  }
}
