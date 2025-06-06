import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from '../../../../domain/ports/repositories/auth.repository';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshTokenModel } from '../schemas/refresh-token.schema';
import { Model, MongooseError } from 'mongoose';
import { RefreshToken } from '../../../../domain/entities/refresh-token.entity';
import { DatabaseError, NotFoundError } from '@app/common/errors';
import { CredentialModel } from '../schemas/credential.schema';
import { Credential } from '../../../../domain/entities/credential.entity';

@Injectable()
export class AuthMongoRepository implements AuthRepository {
  private readonly logger = new Logger(AuthMongoRepository.name);

  constructor(
    @InjectModel(RefreshTokenModel.name)
    private readonly refreshTokenModel: Model<RefreshTokenModel>,
    @InjectModel(CredentialModel.name)
    private readonly credentialModel: Model<CredentialModel>,
  ) {}

  async createRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    try {
      const res = await this.refreshTokenModel.create(
        RefreshTokenModel.fromDomain(refreshToken),
      );

      return RefreshTokenModel.toDomain(res);
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

      return RefreshTokenModel.toDomain(res);
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

  async createCredential(credential: Credential): Promise<Credential> {
    try {
      const res = await this.credentialModel.create(
        CredentialModel.fromDomain(credential),
      );

      return CredentialModel.toDomain(res);
    } catch (error) {
      this.logger.error(
        `error in ${this.createCredential.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getCredential(userId: string): Promise<Credential> {
    try {
      const res = await this.credentialModel
        .findOne({ userId: userId })
        .lean()
        .exec();

      if (!res) throw new NotFoundError('Credential not found');

      return CredentialModel.toDomain(res);
    } catch (error) {
      this.logger.error(
        `error in ${this.getCredential.name}: ${error.message}`,
      );
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }
}
