import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ACCOUNT_DB_COLLECTION, AccountModel } from '../models/account.model';
import { Model, MongooseError, Types } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';
import { IAccountProvider } from '../../providers/account.provider';
import { Account } from '../../../../domain/entities/account.entity';

@Injectable()
export class AccountMongoService implements IAccountProvider {
  private readonly logger = new Logger(AccountMongoService.name);

  constructor(
    @InjectModel(ACCOUNT_DB_COLLECTION)
    private readonly accountModel: Model<AccountModel>,
  ) {}

  async findOneById(id: string): Promise<AccountModel | null> {
    try {
      return await this.accountModel.findById(id, {}, { lean: true }).exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<AccountModel | null> {
    try {
      return await this.accountModel
        .findOne({ email }, {}, { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async add(accountEntity: Account): Promise<void> {
    try {
      await this.accountModel.create(this.fromEntity(accountEntity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async save(account: Account): Promise<void> {
    try {
      await this.accountModel
        .findByIdAndUpdate(account.id, this.fromEntity(account), { lean: true })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  private fromEntity(account: Account): AccountModel {
    return {
      _id: new Types.ObjectId(account.id),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      email: account.email,
    };
  }

  private toEntity(model: AccountModel): Account {
    return new Account(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.email,
    );
  }
}
