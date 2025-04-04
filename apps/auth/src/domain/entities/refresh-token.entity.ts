export class RefreshToken {
  id: string;
  userId: string;
  identifier: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  static create(
    userId: string,
    identifier: string,
    expiresAt: Date,
  ): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.userId = userId;
    refreshToken.identifier = identifier;

    return refreshToken;
  }
}
