import { Observable } from 'rxjs';
import { GetUserByIdRequest, GetUserByIdResponse } from '@app/common/grpc/models/user/get-user-by-id.model';
import { GetUserByEmailRequest, GetUserByEmailResponse } from '@app/common/grpc/models/user/get-user-by-email.model';
import { UserExistsRequest, UserExistsResponse } from '@app/common/grpc/models/user/user-exists.model';
import { CreateUserRequest, CreateUserResponse } from '@app/common/grpc/models/user/create-user.model';

export interface UserGrpcService {
  createUser(req: CreateUserRequest): Promise<Observable<CreateUserResponse>>;

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
