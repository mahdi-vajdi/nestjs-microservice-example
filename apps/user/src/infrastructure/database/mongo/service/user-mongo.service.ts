import { IUserProvider } from '../../../../domain/repositories/user.provider';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { DatabaseError, NotFoundError } from '@app/common/errors';
import { UpdateUserQueryable } from '../../../../domain/repositories/queryables/update-user.queryable';

export class UserMongoService implements IUserProvider {
  private readonly logger = new Logger(UserMongoService.name);

  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).lean().exec();

      if (!user) throw new NotFoundError('User not found');
      return this.toDomain(user);
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
      return this.toDomain(user);
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

      return res.map((user) => this.toDomain(user));
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
        .exists({ $or: [{ email }, { phone }] })
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
      const res = await this.userModel.create(this.fromDomain(entity));
      return this.toDomain(res);
    } catch (error) {
      this.logger.error(`error in ${this.createUser}: ${error.message}`);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async updateUser(
    id: string,
    queryable: UpdateUserQueryable,
  ): Promise<boolean> {
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

  private fromDomain(user: User): UserModel {
    if (!user) return null;

    return {
      _id: new Types.ObjectId(user.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      phone: user.phone,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      avatar: user.avatar,
      online: user.online,
      account: new Types.ObjectId(user.admin),
      role: user.role,
      refreshToken: user.refreshToken,
    };
  }

  private toDomain(userModel: UserModel): User {
    if (!userModel) return null;

    return new User(
      userModel._id.toHexString(),
      userModel.createdAt,
      userModel.updatedAt,
      userModel.account.toHexString(),
      userModel.email,
      userModel.phone,
      userModel.firstName,
      userModel.lastName,
      userModel.title,
      userModel.password,
      userModel.refreshToken,
      userModel.role,
      userModel.avatar,
      userModel.online,
    );
  }
}
