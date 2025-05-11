import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Project } from '../../../../domain/entities/project.entity';

export type ProjectDocument = HydratedDocument<ProjectModel>;

@Schema({ collection: 'projects', timestamps: true, versionKey: false })
export class ProjectModel {
  @Prop({ default: true })
  private: boolean;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  picture: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  // Auto generated fields
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  static fromDomain(project: Project): ProjectModel {
    const projectModel = new ProjectModel();

    projectModel.private = project.private;
    projectModel.title = project.title;
    projectModel.description = project.description;
    projectModel.picture = project.picture;

    return projectModel;
  }

  static toDomain(projectModel: ProjectModel): Project {
    return new Project({
      id: projectModel._id.toHexString(),
      private: projectModel.private,
      picture: projectModel.picture,
      title: projectModel.title,
      description: projectModel.description,
      createdAt: projectModel.createdAt,
      updatedAt: projectModel.updatedAt,
      deletedAt: projectModel.deletedAt,
    });
  }
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);
