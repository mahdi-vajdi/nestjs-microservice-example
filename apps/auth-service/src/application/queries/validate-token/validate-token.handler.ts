import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateTokenQuery } from './validate-token.query';
import { TokenGeneratorPort } from '../../../domain';

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(private readonly tokenGenerator: TokenGeneratorPort) {}

  async execute(query: ValidateTokenQuery): Promise<{ userId: string; role: string; isValid: boolean }> {
    return this.tokenGenerator.verifyAccessToken(query.accessToken);
  }
}
