import { Command } from '@nestjs/cqrs';

export class SignoutCommand extends Command<boolean> {
  constructor(
    public readonly userId: string,
    public readonly identifier: string,
  ) {
    super();
  }
}
