import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Project } from '../../domain/entities/project.entity';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '../../domain/repositories/project.repository';
import { ProjectMember } from '../../domain/entities/project-member.entity';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<Project> {
    try {
      const project = await this.projectRepository.createProject(
        Project.create(dto.private, dto.title, dto.description, dto.picture),
      );

      // Create the owner member for the project
      const projectOwner = await this.projectRepository.createProjectMember(
        ProjectMember.create(project.id, dto.ownerId, {
          role: ProjectMemberRole.OWNER,
          title: dto.title,
        }),
      );

      // Add the owner member to the project
      project.members = [projectOwner];

      return project;
    } catch (error) {
      this.logger.error(`Failed to create project: ${error.message}`);
      throw error;
    }
  }

  async getProjectById(projectId: string): Promise<Project> {
    try {
      return await this.projectRepository.getProject(projectId);
    } catch (error) {
      this.logger.error(
        `Failed to get project bi ID ${projectId}: ${error.message}`,
      );
      throw error;
    }
  }
}
