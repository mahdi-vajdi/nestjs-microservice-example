import { User } from '@app/identity/domain/models/user.model';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<void>;

  abstract findOneById(id: string): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;
}
