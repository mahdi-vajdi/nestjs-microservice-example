export abstract class TokenGeneratorPort {
  abstract generateAccessToken(userId: string, role: string): Promise<{ token: string; expiresIn: number }>;
  abstract generateRefreshToken(userId: string): Promise<{ token: string; expiresIn: number }>;
  abstract verifyAccessToken(token: string): Promise<{ userId: string; role: string; isValid: boolean }>;
}
