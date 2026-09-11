import { UserCredential } from '../models/user-credential.model';

export abstract class UserCredentialRepositoryPort {
  abstract findByEmail(email: string): Promise<UserCredential | null>;
  abstract findByUserId(userId: string): Promise<UserCredential | null>;
  abstract save(userCredential: UserCredential): Promise<void>;
}
