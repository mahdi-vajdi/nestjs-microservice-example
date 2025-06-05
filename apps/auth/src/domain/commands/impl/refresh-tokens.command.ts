import { RefreshTokensDto } from '../dtos/refresh-tokens.dto';
import { Command } from '@nestjs/cqrs';

export class RefreshTokensCommand extends Command<RefreshTokensDto> {
  constructor(
    public readonly userId: string,
    public readonly identifier: string,
  ) {
    super();
  }
}
