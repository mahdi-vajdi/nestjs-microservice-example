import { InvalidInputException } from '@app/common';

import { Email } from './email.value-object';

describe('Email Value Object', () => {
  it('should successfully create an Email with valid address', () => {
    const validEmail = 'user@example.com';
    const email = Email.create(validEmail);

    expect(email.value).toBe(validEmail);
  });

  it('should trim surrounding whitespace from email', () => {
    const raw = '  user@example.com  ';
    const email = Email.create(raw);

    expect(email.value).toBe('user@example.com');
  });

  it('should throw InvalidInputException for malformed emails', () => {
    const invalidEmails = ['', '   ', 'plainaddress', 'user@', '@example.com', 'user@domain'];

    for (const invalid of invalidEmails) {
      expect(() => Email.create(invalid)).toThrow(InvalidInputException);
    }
  });

  it('should return true when comparing two identical Email instances', () => {
    const email1 = Email.create('user@example.com');
    const email2 = Email.create('user@example.com');

    expect(email1.equals(email2)).toBe(true);
  });

  it('should return false when comparing two different Email instances', () => {
    const email1 = Email.create('user1@example.com');
    const email2 = Email.create('user2@example.com');

    expect(email1.equals(email2)).toBe(false);
  });
});
