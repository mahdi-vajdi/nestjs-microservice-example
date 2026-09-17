import { ValidateTokenQuery } from './validate-token.query';
import { ValidateTokenHandler } from './validate-token.handler';

describe('ValidateTokenHandler', () => {
  let handler: ValidateTokenHandler;
  let mockTokenGen: any;

  beforeEach(() => {
    mockTokenGen = { verifyAccessToken: jest.fn() };
    handler = new ValidateTokenHandler(mockTokenGen);
  });

  it('should validate token successfully', async () => {
    mockTokenGen.verifyAccessToken.mockResolvedValue({ userId: 'user-1', role: 'CUSTOMER', isValid: true });
    
    const res = await handler.execute(new ValidateTokenQuery('valid'));
    expect(res.userId).toBe('user-1');
  });

  it('should throw Error on invalid token', async () => {
    mockTokenGen.verifyAccessToken.mockRejectedValue(new Error('bad'));
    
    await expect(handler.execute(new ValidateTokenQuery('bad'))).rejects.toThrow(Error);
  });
});
