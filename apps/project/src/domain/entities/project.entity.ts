import { ProjectMember } from './project-member.entity';

export class Project {
  id: string;
  private: boolean;
  title: string;
  description?: string;
  picture?: string;
  members?: Partial<ProjectMember>[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Partial<Project>) {
    Object.assign(this, init);
  }

  static create(
    isPrivate: boolean,
    title: string,
    description: string,
    picture: string,
  ): Project {
    return new Project({
      private: isPrivate,
      title: title,
      description: description,
      picture: picture,
    });
  }
}
