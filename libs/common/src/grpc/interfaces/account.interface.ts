import { Observable } from 'rxjs';
import {
  GetAccountByIdRequest,
  GetAccountByIdResponse,
} from '@app/common/grpc/models/account/get-account-by-id.model';
import {
  GetAccountByEmailRequest,
  GetAccountByEmailResponse,
} from '@app/common/grpc/models/account/get-account-by-email.model';
import { AccountExistsRequest, AccountExistsResponse } from '@app/common/grpc/models/account/account-exists.model';

export interface IProjectGrpcService {
  getAccountById(
    req: GetAccountByIdRequest,
  ): Promise<Observable<GetAccountByIdResponse>>;

  getAccountByEmail(
    req: GetAccountByEmailRequest,
  ): Promise<Observable<GetAccountByEmailResponse>>;

  accountExists(
    req: AccountExistsRequest,
  ): Promise<Observable<AccountExistsResponse>>;
}
