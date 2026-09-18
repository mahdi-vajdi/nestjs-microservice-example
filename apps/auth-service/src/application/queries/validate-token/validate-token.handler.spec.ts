import { TokenGeneratorPort } from '../../../domain';
import { ValidateTokenHandler } from './validate-token.handler';
import { ValidateTokenQuery } from './validate-token.query';

describe('ValidateTokenHandler', () => {
  let handler: ValidateTokenHandler;
  let mockTokenGen: jest.Mocked<TokenGeneratorPort>;

  beforeEach(() => {
    mockTokenGen = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyAccessToken: jest.fn(),
    };
    handler = new ValidateTokenHandler(mockTokenGen);
  });

  it('should validate token successfully', async () => {
    mockTokenGen.verifyAccessToken.mockResolvedValue({
      userId: 'user-1',
      role: 'CUSTOMER',
      isValid: true,
    });

    const res = await handler.execute(new ValidateTokenQuery('valid'));
    expect(res.userId).toBe('user-1');
  });

  it('should throw Error on invalid token', async () => {
    mockTokenGen.verifyAccessToken.mockRejectedValue(new Error('bad'));

    await expect(handler.execute(new ValidateTokenQuery('bad'))).rejects.toThrow(Error);
  });
});
