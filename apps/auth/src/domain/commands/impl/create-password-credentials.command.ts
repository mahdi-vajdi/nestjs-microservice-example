import { Command } from '@nestjs/cqrs';
import { Credential } from '../../entities/credential.entity';

export class CreatePasswordCredentialsCommand extends Command<Credential> {
  constructor(
    public readonly userId: string,
    public readonly password: string,
  ) {
    super();
  }
}
