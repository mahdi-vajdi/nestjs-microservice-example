import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectService } from '../../application/services/project.service';
import { IProjectGrpcService } from '@app/common/grpc/interfaces/account.interface';
import {
  GetAccountByIdRequest,
  GetAccountByIdResponse,
} from '@app/common/grpc/models/account/get-account-by-id.model';
import {
  GetAccountByEmailRequest,
  GetAccountByEmailResponse,
} from '@app/common/grpc/models/account/get-account-by-email.model';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import {
  AccountExistsRequest,
  AccountExistsResponse,
} from '@app/common/grpc/models/account/account-exists.model';
import { PROJECT_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/project-grpc.config';

@Controller()
export class ProjectGrpcController implements IProjectGrpcService {
  private readonly logger = new Logger(ProjectGrpcController.name);

  constructor(private readonly accountService: ProjectService) {}

  @GrpcMethod(PROJECT_GRPC_SERVICE_NAME, 'GetAccountById')
  async getAccountById(
    req: GetAccountByIdRequest,
  ): Promise<Observable<GetAccountByIdResponse>> {
    return of(await this.accountService.getAccountById(req.id));
  }

  @GrpcMethod(PROJECT_GRPC_SERVICE_NAME, 'GetAccountByEmail')
  async getAccountByEmail(
    req: GetAccountByEmailRequest,
  ): Promise<Observable<GetAccountByEmailResponse>> {
    return of(await this.accountService.getAccountByEmail(req.email));
  }

  @GrpcMethod(PROJECT_GRPC_SERVICE_NAME, 'AccountExists')
  async accountExists(
    req: AccountExistsRequest,
  ): Promise<Observable<AccountExistsResponse>> {
    return of(await this.accountService.accountExists(req.email));
  }
}
