import { ProjectMemberRole } from '../enums/project-member-role.enum';
import { Project } from './project.entity';

export class ProjectMember {
  id: string;
  project: Partial<Project>;
  userId: string;
  role: ProjectMemberRole;
  title?: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(init?: Partial<ProjectMember>) {
    Object.assign(this, init);
  }

  static create(
    projectId: string,
    userId: string,
    options: { role: ProjectMemberRole; title: string },
  ): ProjectMember {
    return new ProjectMember({
      project: { id: projectId },
      userId: userId,
      role: options.role,
      title: options.title,
    });
  }
}
