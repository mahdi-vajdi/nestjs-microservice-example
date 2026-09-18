import { InvalidInputException } from '@app/common';

import {
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredential,
  UserCredentialRepositoryPort,
} from '../../../domain';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenHandler } from './refresh-token.handler';

describe('RefreshTokenHandler', () => {
  let handler: RefreshTokenHandler;
  let mockUserRepo: jest.Mocked<UserCredentialRepositoryPort>;
  let mockTokenGen: jest.Mocked<TokenGeneratorPort>;
  let mockTokenSession: jest.Mocked<TokenSessionRepositoryPort>;

  beforeEach(() => {
    mockUserRepo = {
      findByUserId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockTokenGen = {
      generateAccessToken: jest.fn().mockResolvedValue({ token: 'access', expiresIn: 3600 }),
      generateRefreshToken: jest.fn().mockResolvedValue({ token: 'new_refresh', expiresIn: 7200 }),
      verifyAccessToken: jest.fn(),
    };
    mockTokenSession = {
      findUserIdByToken: jest.fn(),
      revoke: jest.fn(),
      store: jest.fn(),
    };

    handler = new RefreshTokenHandler(mockUserRepo, mockTokenGen, mockTokenSession);
  });

  it('should refresh token successfully', async () => {
    mockTokenSession.findUserIdByToken.mockResolvedValue('user-1');
    mockUserRepo.findByUserId.mockResolvedValue(
      UserCredential.create('user-1', 'test@example.com', 'h', 'C'),
    );

    const result = await handler.execute(new RefreshTokenCommand('valid_token'));
    expect(result.accessToken).toBe('access');
    expect(result.refreshToken).toBe('new_refresh');
    expect(mockTokenSession.revoke).toHaveBeenCalledWith('valid_token');
  });

  it('should throw if token session is invalid', async () => {
    mockTokenSession.findUserIdByToken.mockResolvedValue(null);

    await expect(handler.execute(new RefreshTokenCommand('bad_token'))).rejects.toThrow(
      InvalidInputException,
    );
  });
});
