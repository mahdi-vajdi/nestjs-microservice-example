import { join } from 'node:path';

import {
  CreateUserRequest,
  CreateUserResponse,
} from '@app/shared/contracts/grpc/identity/models/create-user.model';
import {
  GetUserRequest,
  GetUserResponse,
} from '@app/shared/contracts/grpc/identity/models/get-user.model';
import { Observable } from 'rxjs';

export interface IdentityGrpcService {
  createUser(data: CreateUserRequest): Observable<CreateUserResponse>;

  getUser(data: GetUserRequest): Observable<GetUserResponse>;
}

export const IDENTITY_PACKAGE = 'identity';
export const IDENTITY_PROTO_PATH = join(__dirname, '../proto/identity.proto');
