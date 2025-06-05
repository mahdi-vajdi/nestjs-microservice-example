import { Query } from '@nestjs/cqrs';

export class VerifyRefreshTokenQuery extends Query<boolean> {
  constructor(public readonly token: string) {
    super();
  }
}
