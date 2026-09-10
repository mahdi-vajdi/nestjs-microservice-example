import { User } from '../models/user.model';

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
