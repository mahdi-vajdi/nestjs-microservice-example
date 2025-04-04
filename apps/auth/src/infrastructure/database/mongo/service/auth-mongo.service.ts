import { Injectable, Logger } from '@nestjs/common';
import { IAuthProvider } from '../../../../domain/repositories/auth.provider';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { Model, MongooseError } from 'mongoose';
import { RefreshToken } from '../../../../domain/entities/refresh-token.entity';
import { DatabaseError, NotFoundError } from '@app/common/errors';

@Injectable()
export class AuthMongoService implements IAuthProvider {
  private readonly logger = new Logger(AuthMongoService.name);

  constructor(
    @InjectModel(RefreshTokenModel.name)
    private readonly refreshTokenModel: Model<RefreshTokenModel>,
  ) {}

  async createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    try {
      const res = await this.refreshTokenModel.create(
        this.fromDomain(refreshToken),
      );

      return this.toDomain(res);
    } catch (error) {
      this.logger.error(
        `error in ${this.createRefreshToken.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getRefreshToken(
    userId: string,
    identifier: string,
  ): Promise<RefreshToken> {
    try {
      const res = await this.refreshTokenModel
        .findOne({ userId: userId, identifier: identifier })
        .lean()
        .exec();

      if (!res) throw new NotFoundError('Refresh token not found.');

      return this.toDomain(res);
    } catch (error) {
      this.logger.error(
        `error in ${this.createRefreshToken.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async softDeleteRefreshToken(id: string): Promise<boolean> {
    try {
      const res = await this.refreshTokenModel.updateOne(
        { _id: id },
        { $set: { deletedAt: new Date() } },
      );
      if (res.matchedCount == 0)
        throw new NotFoundError('Refresh token not found.');

      return Boolean(res.modifiedCount);
    } catch (error) {
      this.logger.error(
        `error in ${this.softDeleteRefreshToken.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async restoreRefreshToken(id: string): Promise<boolean> {
    try {
      const res = await this.refreshTokenModel.updateOne(
        { _id: id },
        { $set: { deletedAt: null } },
      );
      if (res.matchedCount == 0)
        throw new NotFoundError('Refresh token not found.');

      return Boolean(res.modifiedCount);
    } catch (error) {
      this.logger.error(
        `error in ${this.restoreRefreshToken.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  private fromDomain(refreshToken: RefreshToken): RefreshTokenModel {
    const refreshTokenModel = new RefreshTokenModel();

    refreshTokenModel.userId = refreshToken.userId;
    refreshTokenModel.identifier = refreshToken.identifier;
    refreshTokenModel.expiresAt = refreshToken.expiresAt;

    return refreshTokenModel;
  }

  private toDomain(refreshTokenModel: RefreshTokenModel): RefreshToken {
    const refreshToken = new RefreshToken();

    refreshToken.id = refreshTokenModel._id.toHexString();
    refreshToken.userId = refreshTokenModel.userId;
    refreshToken.identifier = refreshTokenModel.identifier;
    refreshToken.createdAt = refreshTokenModel.createdAt;
    refreshToken.expiresAt = refreshTokenModel.expiresAt;
    refreshToken.updatedAt = refreshTokenModel.updatedAt;
    refreshToken.deletedAt = refreshTokenModel.deletedAt;

    return refreshToken;
  }
}
