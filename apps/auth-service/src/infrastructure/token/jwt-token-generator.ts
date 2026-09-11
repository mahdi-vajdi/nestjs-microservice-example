import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenGeneratorPort } from '../../domain/ports/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements TokenGeneratorPort {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(
    userId: string,
    role: string,
  ): Promise<{ token: string; expiresIn: number }> {
    const expiresIn = 3600; // 1 hour
    const token = await this.jwtService.signAsync({ sub: userId, role }, { expiresIn });
    return { token, expiresIn };
  }

  async generateRefreshToken(userId: string): Promise<{ token: string; expiresIn: number }> {
    const expiresIn = 604800; // 7 days
    const token = await this.jwtService.signAsync({ sub: userId, type: 'refresh' }, { expiresIn });
    return { token, expiresIn };
  }

  async verifyAccessToken(
    token: string,
  ): Promise<{ userId: string; role: string; isValid: boolean }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return {
        userId: payload.sub,
        role: payload.role,
        isValid: true,
      };
    } catch {
      return { userId: '', role: '', isValid: false };
    }
  }
}
