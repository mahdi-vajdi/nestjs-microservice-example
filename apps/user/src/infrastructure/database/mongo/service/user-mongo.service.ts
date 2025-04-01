import { IUserProvider } from '../../providers/user.provider';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserMongoService implements IUserProvider {
  private readonly logger = new Logger(UserMongoService.name);

  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId, {}, { lean: true });
      if (user) return this.toEntity(user);
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await this.userModel
        .findOne({ email }, {}, { lean: true })
        .exec();
      if (user) return user;
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findByAccount(accountId: string): Promise<UserModel[]> {
    try {
      return await this.userModel
        .find({ account: accountId }, {}, { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findIdsByAccount(accountId: string): Promise<string[]> {
    try {
      const models = await this.userModel.find(
        { account: accountId },
        { _id: 1 },
        { lean: true },
      );

      return models.map((model) => model._id.toHexString());
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async userExists(
    email: string,
    phone: string,
  ): Promise<{
    _id: Types.ObjectId;
  } | null> {
    try {
      return await this.userModel
        .exists({ $or: [{ email }, { phone }] })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async add(entity: User): Promise<void> {
    try {
      await this.userModel.create(this.fromEntity(entity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async save(entity: User): Promise<void> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(entity.id, this.fromEntity(entity))
        .exec();

      if (!updatedUser) throw new Error('User not found');
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  private fromEntity(entity: User): UserModel {
    return {
      _id: new Types.ObjectId(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      email: entity.email,
      phone: entity.phone,
      title: entity.title,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      avatar: entity.avatar,
      online: entity.online,
      account: new Types.ObjectId(entity.admin),
      role: entity.role,
      refreshToken: entity.refreshToken,
    };
  }

  private toEntity(model: UserModel): User {
    return new User(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.account.toHexString(),
      model.email,
      model.phone,
      model.firstName,
      model.lastName,
      model.title,
      model.password,
      model.refreshToken,
      model.role,
      model.avatar,
      model.online,
    );
  }
}
