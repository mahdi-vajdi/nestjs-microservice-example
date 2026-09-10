export abstract class TokenSessionRepositoryPort {
  abstract store(token: string, userId: string, ttl: number): Promise<void>;
  abstract findUserIdByToken(token: string): Promise<string | null>;
  abstract revoke(token: string): Promise<void>;
}
