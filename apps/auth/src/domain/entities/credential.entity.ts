export class Credential {
  id: string;
  userId: string;
  passwordHash: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(init?: Partial<Credential>) {
    Object.assign(this, init);
  }

  static create(userId: string, passwordHash: string): Credential {
    const credential = new Credential();

    credential.userId = userId;
    credential.passwordHash = passwordHash;

    return credential;
  }
}
