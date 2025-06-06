import { User } from '../../entities/user.entity';
import { Query } from '@nestjs/cqrs';

export class GetUserByIdQuery extends Query<User> {
  constructor(public readonly id: string) {
    super();
  }
}
