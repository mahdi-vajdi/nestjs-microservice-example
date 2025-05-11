import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProjectMemberRole } from '../../../../domain/enums/project-member-role.enum';
import { ProjectMember } from '../../../../domain/entities/project-member.entity';
import { ProjectModel } from './project.schema';

@Schema({ collection: 'project_members', timestamps: true, versionKey: false })
export class ProjectMemberModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
  projectId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, enum: ProjectMemberRole, required: true })
  role: ProjectMemberRole;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  // Auto generated fields
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(projectMember: ProjectMember): ProjectMemberModel {
    const projectMemberModel = new ProjectMemberModel();

    projectMemberModel.projectId = new mongoose.Types.ObjectId(
      projectMember.project.id,
    );
    projectMemberModel.userId = projectMember.userId;
    projectMemberModel.role = projectMember.role;
    projectMemberModel.title = projectMember.title;

    return projectMemberModel;
  }

  static toDomain(projectMemberModel: ProjectMemberModel): ProjectMember {
    return new ProjectMember({
      id: projectMemberModel._id.toHexString(),
      project: { id: projectMemberModel.projectId.toHexString() }, // FIXME: map the relation
      userId: projectMemberModel.userId,
      role: projectMemberModel.role,
      title: projectMemberModel.title,
      deletedAt: projectMemberModel.deletedAt,
      createdAt: projectMemberModel.createdAt,
      updatedAt: projectMemberModel.updatedAt,
    });
  }
}

export const ProjectMemberSchema =
  SchemaFactory.createForClass(ProjectMemberModel);
