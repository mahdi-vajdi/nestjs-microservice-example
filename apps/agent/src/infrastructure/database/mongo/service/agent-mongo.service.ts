import { IAgentProvider } from '../../providers/agent.provider';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';
import { Agent } from '../../../../domain/entities/agent.entity';
import { AgentModel } from '../models/agent.model';

export class AgentMongoService implements IAgentProvider {
  private readonly logger = new Logger(AgentMongoService.name);

  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async findById(agentId: string): Promise<Agent> {
    try {
      const agent = await this.agentModel.findById(agentId, {}, { lean: true });
      if (agent) return this.toEntity(agent);
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<AgentModel | null> {
    try {
      const agent = await this.agentModel
        .findOne({ email }, {}, { lean: true })
        .exec();
      if (agent) return agent;
      else return null;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async findByAccount(accountId: string): Promise<AgentModel[]> {
    try {
      return await this.agentModel
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
      const models = await this.agentModel.find(
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

  async agentExists(
    email: string,
    phone: string,
  ): Promise<{
    _id: Types.ObjectId;
  } | null> {
    try {
      return await this.agentModel
        .exists({ $or: [{ email }, { phone }] })
        .exec();
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async add(entity: Agent): Promise<void> {
    try {
      await this.agentModel.create(this.fromEntity(entity));
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async save(entity: Agent): Promise<void> {
    try {
      const updatedAgent = await this.agentModel
        .findByIdAndUpdate(entity.id, this.fromEntity(entity))
        .exec();

      if (!updatedAgent) throw new Error('Agent not found');
    } catch (error) {
      this.logger.error(error);

      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  private fromEntity(entity: Agent): AgentModel {
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

  private toEntity(model: AgentModel): Agent {
    return new Agent(
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
