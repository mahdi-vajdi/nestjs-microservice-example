import { Project } from '../../../domain/entities/project.entity';
import { ProjectModel } from '../mongo/models/project.model';

export interface IProjectReader {
  findOneById(id: string): Promise<ProjectModel | null>;

  findOneByEmail(email: string): Promise<ProjectModel | null>;
}

export interface IProjectWriter {
  add(account: Project): Promise<void>;

  save(account: Project): Promise<void>;
}

export interface IProjectProvider extends IProjectReader, IProjectWriter {}

export const PROJECT_PROVIDER = 'project-provider';
