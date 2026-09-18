import { TokenSessionRepositoryPort } from '../../../domain';
import { LogoutCommand } from './logout.command';
import { LogoutHandler } from './logout.handler';

describe('LogoutHandler', () => {
  let handler: LogoutHandler;
  let mockTokenSessionRepo: jest.Mocked<TokenSessionRepositoryPort>;

  beforeEach(() => {
    mockTokenSessionRepo = {
      store: jest.fn().mockResolvedValue(undefined),
      findUserIdByToken: jest.fn().mockResolvedValue(null),
      revoke: jest.fn().mockResolvedValue(undefined),
    };

    handler = new LogoutHandler(mockTokenSessionRepo);
  });

  it('should revoke refresh token when logging out', async () => {
    const refreshToken = 'some-refresh-token';
    const command = new LogoutCommand(refreshToken);

    await handler.execute(command);

    expect(mockTokenSessionRepo.revoke).toHaveBeenCalledTimes(1);
    expect(mockTokenSessionRepo.revoke).toHaveBeenCalledWith(refreshToken);
  });
});
