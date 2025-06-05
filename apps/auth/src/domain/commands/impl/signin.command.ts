import { Command } from '@nestjs/cqrs';
import { SigninDto } from '../dtos/signin.dto';

export class SigninCommand extends Command<SigninDto> {
  constructor(
    public readonly userId: string,
    public readonly password: string,
  ) {
    super();
  }
}
