import { join } from 'node:path';

import { Observable } from 'rxjs';

import { CreateUserRequest, CreateUserResponse } from './models/create-user.model';
import { GetUserRequest, GetUserResponse } from './models/get-user.model';

export interface IdentityGrpcService {
  createUser(data: CreateUserRequest): Observable<CreateUserResponse>;

  getUser(data: GetUserRequest): Observable<GetUserResponse>;
}

export const IDENTITY_SERVICE_NAME = 'IdentityService';
export const IDENTITY_PACKAGE = 'identity';
export const IDENTITY_PROTO_PATH = join(__dirname, '../proto/identity.proto');
