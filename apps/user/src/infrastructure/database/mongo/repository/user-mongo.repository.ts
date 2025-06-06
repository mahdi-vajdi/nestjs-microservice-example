import { UserRepository } from '../../../../domain/ports/repositories/user-repository.interface';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../schemas/user.schema';
import { DatabaseError, NotFoundError } from '@app/common/errors';
import { UpdateUserOptions } from '../../../../domain/ports/repositories/dtos/update-user.options';

export class UserMongoRepository implements UserRepository {
  private readonly logger = new Logger(UserMongoRepository.name);

  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).lean().exec();

      if (!user) throw new NotFoundError('User not found');
      return UserModel.toDomain(user);
    } catch (error) {
      this.logger.error(`error in ${this.getUserById}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email: email }).lean().exec();
      return UserModel.toDomain(user);
    } catch (error) {
      this.logger.error(`error in ${this.getUserByEmail}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getUsersByAccountId(accountId: string): Promise<User[]> {
    try {
      const res = await this.userModel
        .find({ account: accountId })
        .lean()
        .exec();

      return res.map((user) => UserModel.toDomain(user));
    } catch (error) {
      this.logger.error(
        `error in ${this.getUsersByAccountId}: ${error.message}`,
      );

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getUsersIdsByAccountId(accountId: string): Promise<string[]> {
    try {
      const res = await this.userModel
        .find({ account: accountId }, { _id: 1 })
        .lean()
        .exec();

      return res.map((model) => model._id.toHexString());
    } catch (error) {
      this.logger.error(
        `error in ${this.getUsersIdsByAccountId}: ${error.message}`,
      );

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async userExists(email: string, phone: string): Promise<boolean> {
    try {
      const res = await this.userModel
        .exists({ $or: [{ email }, { mobile: phone }] })
        .exec();

      return Boolean(res);
    } catch (error) {
      this.logger.error(`error in ${this.userExists}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async createUser(entity: User): Promise<User> {
    try {
      const res = await this.userModel.create(UserModel.fromDomain(entity));
      return UserModel.toDomain(res);
    } catch (error) {
      this.logger.error(`error in ${this.createUser}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async updateUser(id: string, queryable: UpdateUserOptions): Promise<boolean> {
    try {
      const res = await this.userModel
        .updateOne(
          { _id: id },
          { $set: { refreshToken: queryable.refreshToken } },
        )
        .lean()
        .exec();

      if (res.matchedCount == 0) {
        throw new NotFoundError('User not found');
      }

      return res.modifiedCount != 0;
    } catch (error) {
      this.logger.error(`error in ${this.updateUser.name}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }
}
