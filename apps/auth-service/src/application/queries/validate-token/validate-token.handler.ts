import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TokenGeneratorPort } from '../../../domain';
import { ValidateTokenQuery } from './validate-token.query';

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(private readonly tokenGenerator: TokenGeneratorPort) {}

  async execute(
    query: ValidateTokenQuery,
  ): Promise<{ userId: string; role: string; isValid: boolean }> {
    return this.tokenGenerator.verifyAccessToken(query.accessToken);
  }
}
