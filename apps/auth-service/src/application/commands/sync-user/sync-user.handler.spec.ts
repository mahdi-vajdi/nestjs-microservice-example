import { UserCredential } from '../../../domain';
import { SyncUserCommand } from './sync-user.command';
import { SyncUserHandler } from './sync-user.handler';

describe('SyncUserHandler', () => {
  let handler: SyncUserHandler;
  let mockUserRepo: any;

  beforeEach(() => {
    mockUserRepo = { findByUserId: jest.fn(), save: jest.fn() };
    handler = new SyncUserHandler(mockUserRepo);
  });

  it('should create user', async () => {
    mockUserRepo.findByUserId.mockResolvedValue(null);
    await handler.execute(
      new SyncUserCommand('u-1', {
        action: 'CREATE',
        email: 'test@example.com',
        passwordHash: 'h',
        role: 'C',
      }),
    );
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('should update password', async () => {
    const cred = UserCredential.create('u-1', 'test@example.com', 'h', 'C');
    mockUserRepo.findByUserId.mockResolvedValue(cred);

    await handler.execute(
      new SyncUserCommand('u-1', { action: 'CHANGE_PASSWORD', passwordHash: 'new_h' }),
    );
    expect(cred.passwordHash).toBe('new_h');
    expect(mockUserRepo.save).toHaveBeenCalled();
  });
});
