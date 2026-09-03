import { ConflictException, InvalidInputException } from '@app/common';

import { User, UserRepositoryPort, UserRole } from '../../../domain';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let mockUserRepo: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    mockUserRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findOneById: jest.fn().mockResolvedValue(null),
      findOneByEmail: jest.fn().mockResolvedValue(null),
    };

    handler = new CreateUserHandler(mockUserRepo);
  });

  it('should successfully create and persist a new user', async () => {
    const command = new CreateUserCommand('user@example.com', 'strongpassword123');

    const userId = await handler.execute(command);

    expect(userId).toBeDefined();
    expect(typeof userId).toBe('string');
    expect(mockUserRepo.findOneByEmail).toHaveBeenCalledWith('user@example.com');
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);

    const savedUser = mockUserRepo.save.mock.calls[0][0] as User;
    expect(savedUser.email).toBe('user@example.com');
    expect(savedUser.isActive).toBe(true);
    expect(savedUser.getUncommittedEvents()).toHaveLength(1);
  });

  it('should throw ConflictException if a user with the same email already exists', async () => {
    const existingUser = User.reconstitute(
      'existing-id',
      new Date(),
      new Date(),
      'existing@example.com',
      'hashed_pwd',
      UserRole.CUSTOMER,
      true,
    );
    mockUserRepo.findOneByEmail.mockResolvedValue(existingUser);

    const command = new CreateUserCommand('existing@example.com', 'strongpassword123');

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidInputException if email is invalid', async () => {
    const command = new CreateUserCommand('not-an-email', 'strongpassword123');

    await expect(handler.execute(command)).rejects.toThrow(InvalidInputException);
    expect(mockUserRepo.findOneByEmail).not.toHaveBeenCalled();
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidInputException if password is too short', async () => {
    const command = new CreateUserCommand('user@example.com', 'short');

    await expect(handler.execute(command)).rejects.toThrow(InvalidInputException);
    expect(mockUserRepo.findOneByEmail).not.toHaveBeenCalled();
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });
});
