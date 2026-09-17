import { UserCredential } from './user-credential.model';

describe('UserCredential Model', () => {
  it('should create a new user credential with correct values', () => {
    const cred = UserCredential.create('user-1', 'test@example.com', 'hashedpwd', 'CUSTOMER');
    expect(cred.id).toBe('user-1');
    expect(cred.email).toBe('test@example.com');
    expect(cred.passwordHash).toBe('hashedpwd');
    expect(cred.role).toBe('CUSTOMER');
    expect(cred.isActive).toBe(true);
  });

  it('should reconstitute a user credential', () => {
    const now = new Date();
    const cred = UserCredential.reconstitute(
      'user-1',
      now,
      now,
      'test@example.com',
      'hashedpwd',
      'CUSTOMER',
      false,
    );
    expect(cred.id).toBe('user-1');
    expect(cred.isActive).toBe(false);
  });

  it('should update properties', () => {
    const cred = UserCredential.create('user-1', 'test@example.com', 'hashedpwd', 'CUSTOMER');
    cred.updatePassword('newhash');
    expect(cred.passwordHash).toBe('newhash');

    cred.updateRole('ADMIN');
    expect(cred.role).toBe('ADMIN');

    cred.deactivate();
    expect(cred.isActive).toBe(false);

    cred.activate();
    expect(cred.isActive).toBe(true);
  });
});
