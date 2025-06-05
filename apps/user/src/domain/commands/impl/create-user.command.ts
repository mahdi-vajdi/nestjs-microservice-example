import { Command } from '@nestjs/cqrs';
import { User } from '../../entities/user.entity';

export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly mobile: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatar: string,
  ) {
    super();
  }
}
