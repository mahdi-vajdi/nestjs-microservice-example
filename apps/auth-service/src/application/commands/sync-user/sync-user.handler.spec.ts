import { UserCredential, UserCredentialRepositoryPort } from '../../../domain';
import { SyncUserCommand } from './sync-user.command';
import { SyncUserHandler } from './sync-user.handler';

describe('SyncUserHandler', () => {
  let handler: SyncUserHandler;
  let mockUserRepo: jest.Mocked<UserCredentialRepositoryPort>;

  beforeEach(() => {
    mockUserRepo = {
      findByUserId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };
    handler = new SyncUserHandler(mockUserRepo);
  });

  describe('CREATE', () => {
    it('should create and save user when not existing', async () => {
      mockUserRepo.findByUserId.mockResolvedValue(null);

      await handler.execute(
        new SyncUserCommand('u-1', {
          action: 'CREATE',
          email: 'test@example.com',
          passwordHash: 'h',
          role: 'CUSTOMER',
        }),
      );

      expect(mockUserRepo.findByUserId).toHaveBeenCalledWith('u-1');
      expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
      const saved = mockUserRepo.save.mock.calls[0][0];
      expect(saved.id).toBe('u-1');
      expect(saved.email).toBe('test@example.com');
      expect(saved.role).toBe('CUSTOMER');
      expect(saved.isActive).toBe(true);
    });

    it('should not save if user already exists', async () => {
      const existing = UserCredential.create('u-1', 'test@example.com', 'h', 'CUSTOMER');
      mockUserRepo.findByUserId.mockResolvedValue(existing);

      await handler.execute(
        new SyncUserCommand('u-1', {
          action: 'CREATE',
          email: 'test@example.com',
          passwordHash: 'h',
          role: 'CUSTOMER',
        }),
      );

      expect(mockUserRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('Non-CREATE when user not found', () => {
    it('should silently return and not throw if user does not exist', async () => {
      mockUserRepo.findByUserId.mockResolvedValue(null);

      await expect(
        handler.execute(
          new SyncUserCommand('u-1', {
            action: 'CHANGE_PASSWORD',
            passwordHash: 'new_pwd',
          }),
        ),
      ).resolves.not.toThrow();

      expect(mockUserRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('CHANGE_PASSWORD', () => {
    it('should update password and save', async () => {
      const cred = UserCredential.create('u-1', 'test@example.com', 'old_pwd', 'CUSTOMER');
      mockUserRepo.findByUserId.mockResolvedValue(cred);

      await handler.execute(
        new SyncUserCommand('u-1', { action: 'CHANGE_PASSWORD', passwordHash: 'new_pwd' }),
      );

      expect(cred.passwordHash).toBe('new_pwd');
      expect(mockUserRepo.save).toHaveBeenCalledWith(cred);
    });
  });

  describe('CHANGE_ROLE', () => {
    it('should update role and save', async () => {
      const cred = UserCredential.create('u-1', 'test@example.com', 'pwd', 'CUSTOMER');
      mockUserRepo.findByUserId.mockResolvedValue(cred);

      await handler.execute(
        new SyncUserCommand('u-1', { action: 'CHANGE_ROLE', role: 'ADMIN' }),
      );

      expect(cred.role).toBe('ADMIN');
      expect(mockUserRepo.save).toHaveBeenCalledWith(cred);
    });
  });

  describe('DEACTIVATE', () => {
    it('should deactivate user and save', async () => {
      const cred = UserCredential.create('u-1', 'test@example.com', 'pwd', 'CUSTOMER', true);
      mockUserRepo.findByUserId.mockResolvedValue(cred);

      await handler.execute(new SyncUserCommand('u-1', { action: 'DEACTIVATE' }));

      expect(cred.isActive).toBe(false);
      expect(mockUserRepo.save).toHaveBeenCalledWith(cred);
    });
  });

  describe('ACTIVATE', () => {
    it('should activate user and save', async () => {
      const cred = UserCredential.create('u-1', 'test@example.com', 'pwd', 'CUSTOMER', false);
      mockUserRepo.findByUserId.mockResolvedValue(cred);

      await handler.execute(new SyncUserCommand('u-1', { action: 'ACTIVATE' }));

      expect(cred.isActive).toBe(true);
      expect(mockUserRepo.save).toHaveBeenCalledWith(cred);
    });
  });
});
