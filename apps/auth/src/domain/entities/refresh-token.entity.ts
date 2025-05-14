export class RefreshToken {
  id: string;
  userId: string;
  identifier: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Partial<RefreshToken>) {
    Object.assign(this, init);
  }

  static create(userId: string, identifier: string): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.userId = userId;
    refreshToken.identifier = identifier;

    return refreshToken;
  }
}
