import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectModel } from '../models/project.schema';
import { Model, MongooseError } from 'mongoose';
import { DatabaseError } from '@app/common/errors/database.error';
import { Project } from '../../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../../domain/repositories/project.repository';
import { ProjectMemberModel } from '../models/project-member.schema';
import { ProjectMember } from '../../../../domain/entities/project-member.entity';
import { BaseError, NotFoundError } from '@app/common/errors';

@Injectable()
export class ProjectMongoService implements ProjectRepository {
  private readonly logger = new Logger(ProjectMongoService.name);

  constructor(
    @InjectModel(ProjectModel.name)
    private readonly projectModel: Model<ProjectModel>,
    @InjectModel(ProjectMemberModel.name)
    private readonly projectMemberModel: Model<ProjectMemberModel>,
  ) {}

  async getProject(id: string): Promise<Project> {
    try {
      const res = await this.projectModel
        .findById(id, {}, { lean: true })
        .exec();

      if (!res) {
        throw new NotFoundError('Project not found');
      }

      return ProjectModel.toDomain(res);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getProjects(ownerId: string): Promise<Project> {
    try {
      const res = await this.projectModel
        .findOne({ ownerId: ownerId }, {}, { lean: true })
        .exec();

      return ProjectModel.toDomain(res);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async createProject(project: Project): Promise<Project> {
    try {
      const res = await this.projectModel.create(
        ProjectModel.fromDomain(project),
      );

      return ProjectModel.toDomain(res);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async createProjectMember(
    projectMember: ProjectMember,
  ): Promise<ProjectMember> {
    try {
      const res = await this.projectMemberModel.create(
        ProjectMemberModel.fromDomain(projectMember),
      );

      return ProjectMemberModel.toDomain(res);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getProjectMember(id: string): Promise<ProjectMember> {
    try {
      const res = await this.projectMemberModel
        .findById(id, {}, { lean: true })
        .exec();

      if (!res) {
        throw new NotFoundError('Project member not found');
      }

      return ProjectMemberModel.toDomain(res);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      const res = await this.projectMemberModel
        .find({ projectId: projectId }, {}, { lean: true })
        .exec();

      return res.map((projectMember) =>
        ProjectMemberModel.toDomain(projectMember),
      );
    } catch (error) {
      this.logger.error(error);
      if (error instanceof BaseError) throw error;
      if (error instanceof MongooseError)
        throw new DatabaseError(error.message);
      else throw new Error(error.message);
    }
  }
}
