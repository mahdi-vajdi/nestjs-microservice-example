export const PASSWORD_HASHER_PORT = Symbol('PASSWORD_HASHER_PORT');

export abstract class PasswordHasherPort {
  abstract hash(plainText: string): Promise<string>;
  abstract compare(plainText: string, hash: string): Promise<boolean>;
}
