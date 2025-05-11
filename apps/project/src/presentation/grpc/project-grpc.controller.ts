import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ProjectService } from '../../application/services/project.service';
import { ProjectGrpcService } from '@app/common/grpc/interfaces/project.interface';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { PROJECT_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/project-grpc.config';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';
import { Result } from '@app/common/result';
import {
  GetProjectByIdRequest,
  GetProjectByIdResponse,
} from '@app/common/grpc/models/project/get-project-by-id.model';
import {
  CreateProjectRequest,
  CreateProjectResponse,
} from '@app/common/grpc/models/project/create-project.model';

@Controller()
export class ProjectGrpcController implements ProjectGrpcService {
  private readonly logger = new Logger(ProjectGrpcController.name);

  constructor(private readonly projectService: ProjectService) {}

  @GrpcMethod(PROJECT_GRPC_SERVICE_NAME, 'CreateProject')
  async createProject(
    req: CreateProjectRequest,
  ): Promise<Observable<CreateProjectResponse>> {
    try {
      const res = await this.projectService.createProject({
        title: req.title,
        description: req.description,
        picture: req.picture,
        private: req.private,
        ownerId: req.ownerId,
        ownerTitle: req.ownerTitle,
      });

      return of({
        id: res.id,
        ownerId:
          res.members.find((m) => m.role == ProjectMemberRole.OWNER)?.id ??
          null,
        createdAt: res.createdAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.createProject.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  async getProjectById(
    req: GetProjectByIdRequest,
  ): Promise<Observable<GetProjectByIdResponse>> {
    try {
      const res = await this.projectService.getProjectById(req.id);

      return of({
        title: res.title,
        description: res.description,
        private: res.private,
        ownerId:
          res.members.find((m) => m.role == ProjectMemberRole.OWNER)?.id ??
          null,
        picture: res.picture,
        createdAt: res.createdAt.toISOString(),
        updatedAt: res.updatedAt.toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.getProjectById.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }
}
