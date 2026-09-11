import { ConflictException, InvalidInputException } from '@app/common';

import { User, UserRepositoryPort, UserRole } from '../../../domain';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let mockUserRepo: jest.Mocked<UserRepositoryPort>;
  let mockPasswordHasher: jest.Mocked<any>;

  beforeEach(() => {
    mockUserRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    mockPasswordHasher = {
      hash: jest.fn().mockResolvedValue('hashed_pwd'),
      compare: jest.fn().mockResolvedValue(true),
    };

    handler = new CreateUserHandler(mockUserRepo, mockPasswordHasher);
  });

  it('should successfully create and persist a new user', async () => {
    const command = new CreateUserCommand('user@example.com', 'strongpassword123');

    const userId = await handler.execute(command);

    expect(userId).toBeDefined();
    expect(typeof userId.id).toBe('string');
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);

    const savedUser = mockUserRepo.save.mock.calls[0][0] as User;
    expect(savedUser.email).toBe('user@example.com');
    expect(savedUser.isActive).toBe(true);
    expect(savedUser.getUncommittedEvents()).toHaveLength(1);
  });

  it('should throw ConflictException if a user with the same email already exists', async () => {
    const existingUser = User.reconstitute({
      id: 'existing-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'existing@example.com',
      passwordHash: 'hashed_pwd',
      role: UserRole.CUSTOMER,
      isActive: true,
      lastLoginAt: undefined,
    });
    mockUserRepo.findByEmail.mockResolvedValue(existingUser);

    const command = new CreateUserCommand('existing@example.com', 'strongpassword123');

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidInputException if email is invalid', async () => {
    const command = new CreateUserCommand('not-an-email', 'strongpassword123');

    await expect(handler.execute(command)).rejects.toThrow(InvalidInputException);
    expect(mockUserRepo.findByEmail).not.toHaveBeenCalled();
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidInputException if password is too short', async () => {
    const command = new CreateUserCommand('user@example.com', 'short');

    await expect(handler.execute(command)).rejects.toThrow(InvalidInputException);
    expect(mockUserRepo.findByEmail).not.toHaveBeenCalled();
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });
});
