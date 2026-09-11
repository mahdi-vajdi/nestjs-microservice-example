import { InvalidInputException } from '@app/common';

import { Password } from './password.value-object';

describe('Password Value Object', () => {
  it('should successfully create a Password within valid length bounds', () => {
    const validPassword = 'supersecretpassword';
    const password = Password.create(validPassword);

    expect(password.value).toBe(validPassword);
  });

  it('should allow passwords with exact minimum and maximum length bounds (8 and 32)', () => {
    const minPassword = 'a'.repeat(8);
    const maxPassword = 'a'.repeat(32);

    expect(Password.create(minPassword).value).toBe(minPassword);
    expect(Password.create(maxPassword).value).toBe(maxPassword);
  });

  it('should throw InvalidInputException if password is shorter than 8 characters', () => {
    const shortPassword = 'short';
    expect(() => Password.create(shortPassword)).toThrow(InvalidInputException);
  });

  it('should throw InvalidInputException if password is longer than 32 characters', () => {
    const longPassword = 'a'.repeat(33);
    expect(() => Password.create(longPassword)).toThrow(InvalidInputException);
  });

  it('should throw InvalidInputException if password is empty or not provided', () => {
    expect(() => Password.create('')).toThrow(InvalidInputException);
    expect(() => Password.create(null as unknown as string)).toThrow(InvalidInputException);
  });

  it('should return true when comparing two identical Password instances', () => {
    const pwd1 = Password.create('password123');
    const pwd2 = Password.create('password123');

    expect(pwd1.equals(pwd2)).toBe(true);
  });

  it('should return false when comparing two different Password instances', () => {
    const pwd1 = Password.create('password123');
    const pwd2 = Password.create('password456');

    expect(pwd1.equals(pwd2)).toBe(false);
  });
});
