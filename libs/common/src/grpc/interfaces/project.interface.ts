import { Observable } from 'rxjs';
import { CreateProjectRequest, CreateProjectResponse } from '@app/common/grpc/models/project/create-project.model';
import { GetProjectByIdRequest, GetProjectByIdResponse } from '@app/common/grpc/models/project/get-project-by-id.model';

export interface ProjectGrpcService {
  createProject(
    req: CreateProjectRequest,
  ): Promise<Observable<CreateProjectResponse>>;

  getProjectById(
    req: GetProjectByIdRequest,
  ): Promise<Observable<GetProjectByIdResponse>>;
}
