import { Controller, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProjectService } from '../../application/services/project.service';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';
import { Result } from '@app/common/result';
import {
  CreateProjectRequest,
  CreateProjectResponse,
  GetProjectByIdRequest,
  GetProjectByIdResponse,
  ProjectServiceController,
  ProjectServiceControllerMethods,
} from '@app/common/grpc/models/project.proto';

@Controller()
@ProjectServiceControllerMethods()
export class ProjectGrpcController implements ProjectServiceController {
  private readonly logger = new Logger(ProjectGrpcController.name);

  constructor(private readonly projectService: ProjectService) {}

  async createProject(
    req: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    try {
      const res = await this.projectService.createProject({
        title: req.title,
        description: req.description,
        picture: req.picture,
        private: req.private,
        ownerId: req.ownerId,
        ownerTitle: req.ownerTitle,
      });

      return {
        id: res.id,
        ownerId:
          res.members.find((m) => m.role == ProjectMemberRole.OWNER)?.id ??
          null,
        createdAt: res.createdAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `error in ${this.createProject.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  async getProjectById(
    req: GetProjectByIdRequest,
  ): Promise<GetProjectByIdResponse> {
    try {
      const res = await this.projectService.getProjectById(req.id);

      return {
        title: res.title,
        description: res.description,
        private: res.private,
        ownerId:
          res.members.find((m) => m.role == ProjectMemberRole.OWNER)?.id ??
          null,
        picture: res.picture,
        createdAt: res.createdAt.toISOString(),
        updatedAt: res.updatedAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `error in ${this.getProjectById.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }
}
