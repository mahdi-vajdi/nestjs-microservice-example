export abstract class PasswordVerifierPort {
  abstract verify(plainText: string, hash: string): Promise<boolean>;
}
