import { InvalidInputException, NotFoundException } from '@app/common';

import { User, UserRepositoryPort, UserRole } from '../../../domain';
import { GetUserHandler } from './get-user.handler';
import { GetUserQuery } from './get-user.query';

describe('GetUserHandler', () => {
  let handler: GetUserHandler;
  let mockUserRepo: jest.Mocked<UserRepositoryPort>;

  const validUserId = '11111111-2222-4333-8444-555555555555';

  beforeEach(() => {
    mockUserRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findOneById: jest.fn().mockResolvedValue(null),
      findOneByEmail: jest.fn().mockResolvedValue(null),
    };

    handler = new GetUserHandler(mockUserRepo);
  });

  it('should successfully return UserResponseDto when user exists', async () => {
    const user = User.reconstitute(
      validUserId,
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-01-01T00:00:00Z'),
      'user@example.com',
      'hashed_pwd',
      UserRole.CUSTOMER,
      true,
    );
    mockUserRepo.findOneById.mockResolvedValue(user);

    const query = new GetUserQuery(validUserId);
    const result = await handler.execute(query);

    expect(result).toEqual({
      id: validUserId,
      email: 'user@example.com',
      role: UserRole.CUSTOMER,
      isActive: true,
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    });
    expect(mockUserRepo.findOneById).toHaveBeenCalledWith(validUserId);
  });

  it('should throw NotFoundException when user is not found', async () => {
    mockUserRepo.findOneById.mockResolvedValue(null);

    const query = new GetUserQuery(validUserId);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    expect(mockUserRepo.findOneById).toHaveBeenCalledWith(validUserId);
  });

  it('should throw InvalidInputException when user ID is not a valid UUID', async () => {
    const invalidIds = ['', '   ', 'not-a-uuid', '12345', '11111111-2222-3333-4444'];

    for (const invalidId of invalidIds) {
      const query = new GetUserQuery(invalidId);
      await expect(handler.execute(query)).rejects.toThrow(InvalidInputException);
    }

    expect(mockUserRepo.findOneById).not.toHaveBeenCalled();
  });
});
