import { InvalidInputException } from '@app/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  PasswordVerifierPort,
  TokenGeneratorPort,
  TokenSessionRepositoryPort,
  UserCredential,
  UserCredentialRepositoryPort,
} from '../../../domain';
import { AuthResponseDto } from '../../dtos/auth.response.dto';
import { LoginCommand } from './login.command';
import { LoginHandler } from './login.handler';

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let userRepo: jest.Mocked<UserCredentialRepositoryPort>;
  let tokenGenerator: jest.Mocked<TokenGeneratorPort>;
  let tokenSessionRepo: jest.Mocked<TokenSessionRepositoryPort>;
  let passwordVerifier: jest.Mocked<PasswordVerifierPort>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
    } as any;

    tokenGenerator = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyAccessToken: jest.fn(),
    } as any;

    tokenSessionRepo = {
      store: jest.fn(),
      findUserIdByToken: jest.fn(),
      revoke: jest.fn(),
    } as any;

    passwordVerifier = {
      verify: jest.fn(),
    } as any;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((obj) => obj),
    } as any;

    handler = new LoginHandler(
      userRepo,
      tokenGenerator,
      tokenSessionRepo,
      passwordVerifier,
      eventPublisher,
    );
  });

  it('should throw when user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(handler.execute(new LoginCommand('test@test.com', 'pwd'))).rejects.toThrow(
      InvalidInputException,
    );
  });

  it('should throw when user is inactive', async () => {
    const cred = UserCredential.create('1', 'test@test.com', 'hash', 'CUSTOMER', false);
    userRepo.findByEmail.mockResolvedValue(cred);

    await expect(handler.execute(new LoginCommand('test@test.com', 'pwd'))).rejects.toThrow(
      InvalidInputException,
    );
  });

  it('should throw when password is wrong', async () => {
    const cred = UserCredential.create('1', 'test@test.com', 'hash', 'CUSTOMER', true);
    userRepo.findByEmail.mockResolvedValue(cred);
    passwordVerifier.verify.mockResolvedValue(false);

    await expect(handler.execute(new LoginCommand('test@test.com', 'wrong'))).rejects.toThrow(
      InvalidInputException,
    );
  });

  it('should return tokens and save on success', async () => {
    const cred = UserCredential.create('1', 'test@test.com', 'hash', 'CUSTOMER', true);
    jest.spyOn(cred, 'login');
    jest.spyOn(cred, 'commit');
    userRepo.findByEmail.mockResolvedValue(cred);
    passwordVerifier.verify.mockResolvedValue(true);
    tokenGenerator.generateAccessToken.mockResolvedValue({ token: 'access', expiresIn: 3600 });
    tokenGenerator.generateRefreshToken.mockResolvedValue({ token: 'refresh', expiresIn: 86400 });

    const result = await handler.execute(new LoginCommand('test@test.com', 'pwd'));

    expect(result).toBeInstanceOf(AuthResponseDto);
    expect(result.accessToken).toBe('access');
    expect(result.refreshToken).toBe('refresh');

    expect(cred.login).toHaveBeenCalled();
    expect(userRepo.save).toHaveBeenCalledWith(cred);
    expect(cred.commit).toHaveBeenCalled();
  });
});
