import { Observable } from 'rxjs';

import { CreateUserRequest, CreateUserResponse } from './models/create-user.model';
import { GetUserRequest, GetUserResponse } from './models/get-user.model';
import { GetUserByEmailRequest } from './models/get-user-by-email.model';

export interface UserGrpcService {
  createUser(data: CreateUserRequest, metadata?: any): Observable<CreateUserResponse>;
  getUser(data: GetUserRequest, metadata?: any): Observable<GetUserResponse>;
  getUserByEmail(data: GetUserByEmailRequest, metadata?: any): Observable<GetUserResponse>;
}

export const USER_SERVICE_NAME = 'UserService';
export const USER_PACKAGE = 'user';
export const USER_PROTO_PATH = require('node:path').join(__dirname, '../proto/user.proto');
export const USER_GRPC_CLIENT = 'USER_GRPC_CLIENT' as const;
