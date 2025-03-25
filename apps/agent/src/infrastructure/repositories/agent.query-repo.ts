import { InjectModel } from '@nestjs/mongoose';
import { AgentModel } from '../models/agent.model';
import { Model, MongooseError, Types } from 'mongoose';
import { Logger } from '@nestjs/common';
import { DatabaseError } from '@app/common/errors/database.error';

export class AgentQueryRepository {
  private readonly logger = new Logger(AgentQueryRepository.name);

  constructor(
    @InjectModel(AgentModel.name)
    private readonly agentModel: Model<AgentModel>,
  ) {}

  async findById(agentId: string): Promise<AgentModel | null> {
    try {
      const agent = await this.agentModel.findById(agentId, {}, { lean: true });
      if (agent) return agent;
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
}
