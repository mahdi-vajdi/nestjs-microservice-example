import { Project } from '../entities/project.entity';
import { ProjectMember } from '../entities/project-member.entity';

export interface ProjectReaderRepository {
  getProject(id: string): Promise<Project>;

  getProjects(ownerId: string): Promise<Project>;

  getProjectMember(id: string): Promise<ProjectMember>;

  getProjectMembers(projectId: string): Promise<ProjectMember[]>;
}

export interface ProjectWriterRepository {
  createProject(project: Project): Promise<Project>;

  createProjectMember(projectMember: ProjectMember): Promise<ProjectMember>;
}

export interface ProjectRepository
  extends ProjectReaderRepository,
    ProjectWriterRepository {}

export const PROJECT_READER_REPOSITORY = 'project-reader-repository';
export const PROJECT_WRITER_REPOSITORY = 'project-writer-repository';
export const PROJECT_REPOSITORY = 'project-repository';
