import { InvalidInputException } from '@app/common';
import { randomUUID } from 'crypto';

import { UserCredential } from '../../../domain';
import { LoginCommand } from './login.command';
import { LoginHandler } from './login.handler';

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('fake-uuid'),
}));

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let mockUserRepo: any;
  let mockTokenGen: any;
  let mockTokenSession: any;
  let mockPassVerifier: any;
  let mockOutboxRepo: any;

  beforeEach(() => {
    mockUserRepo = { findByEmail: jest.fn() };
    mockTokenGen = {
      generateAccessToken: jest.fn().mockResolvedValue({ token: 'access', expiresIn: 3600 }),
      generateRefreshToken: jest.fn().mockResolvedValue({ token: 'refresh', expiresIn: 7200 }),
    };
    mockTokenSession = { store: jest.fn() };
    mockPassVerifier = { verify: jest.fn() };
    mockOutboxRepo = { save: jest.fn() };

    handler = new LoginHandler(
      mockUserRepo,
      mockTokenGen,
      mockTokenSession,
      mockPassVerifier,
      mockOutboxRepo,
    );
  });

  it('should successfully log in', async () => {
    const cred = UserCredential.create('user-1', 'test@example.com', 'hashed', 'CUSTOMER');
    mockUserRepo.findByEmail.mockResolvedValue(cred);
    mockPassVerifier.verify.mockResolvedValue(true);

    const result = await handler.execute(new LoginCommand('test@example.com', 'password'));

    expect(result.accessToken).toBe('access');
    expect(mockTokenGen.generateAccessToken).toHaveBeenCalledWith('user-1', 'CUSTOMER');
    expect(mockTokenSession.store).toHaveBeenCalled();
    expect(mockOutboxRepo.save).toHaveBeenCalled();
  });

  it('should throw on invalid user', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    await expect(handler.execute(new LoginCommand('test@example.com', 'password'))).rejects.toThrow(
      InvalidInputException,
    );
  });
});
