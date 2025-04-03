import { Observable } from 'rxjs';
import { GetAccountUsersRequest, GetAccountUsersResponse } from '@app/common/grpc/models/user/get-account-users.model';
import { GetUserIdsRequest, GetUserIdsResponse } from '@app/common/grpc/models/user/get-user-ids.model';
import { GetUserByIdRequest, GetUserByIdResponse } from '@app/common/grpc/models/user/get-user-by-id.model';
import { GetUserByEmailRequest, GetUserByEmailResponse } from '@app/common/grpc/models/user/get-user-by-email.model';
import { UserExistsRequest, UserExistsResponse } from '@app/common/grpc/models/user/user-exists.model';

export interface IUserGrpcService {
  getAccountUsers(
    req: GetAccountUsersRequest,
  ): Promise<Observable<GetAccountUsersResponse>>;

  getUserIds(
    req: GetUserIdsRequest,
  ): Promise<Observable<GetUserIdsResponse>>;

  getUserById(
    req: GetUserByIdRequest,
  ): Promise<Observable<GetUserByIdResponse>>;

  getUserByEmail(
    req: GetUserByEmailRequest,
  ): Promise<Observable<GetUserByEmailResponse>>;

  userExists(
    req: UserExistsRequest,
  ): Promise<Observable<UserExistsResponse>>;
}
