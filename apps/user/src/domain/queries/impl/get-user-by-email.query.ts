import { User } from '../../entities/user.entity';
import { Query } from '@nestjs/cqrs';

export class GetUserByEmailQuery extends Query<User> {
  constructor(public readonly email: string) {
    super();
  }
}
