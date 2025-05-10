import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectModel } from '../models/project.model';
import { Model, MongooseError, Types } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';
import { IProjectProvider } from '../../providers/project.provider';
import { Project } from '../../../../domain/entities/project.entity';

@Injectable()
export class ProjectMongoService implements IProjectProvider {
  private readonly logger = new Logger(ProjectMongoService.name);

  constructor(
    @InjectModel(ProjectModel.name)
    private readonly accountModel: Model<ProjectModel>,
  ) {}

  async findOneById(id: string): Promise<ProjectModel | null> {
    try {
      return await this.accountModel.findById(id, {}, { lean: true }).exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<ProjectModel | null> {
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

  async add(accountEntity: Project): Promise<void> {
    try {
      await this.accountModel.create(this.fromEntity(accountEntity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async save(account: Project): Promise<void> {
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

  private fromEntity(account: Project): ProjectModel {
    return {
      _id: new Types.ObjectId(account.id),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      email: account.email,
    };
  }

  private toEntity(model: ProjectModel): Project {
    return new Project(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.email,
    );
  }
}
