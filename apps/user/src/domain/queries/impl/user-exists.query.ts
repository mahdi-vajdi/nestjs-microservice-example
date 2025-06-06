import { Query } from '@nestjs/cqrs';

export class UserExistsQuery extends Query<boolean> {
  constructor(
    public readonly email: string,
    public readonly mobile: string,
  ) {
    super();
  }
}
