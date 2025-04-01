export interface UserExistsRequest {
  email: string;
  phone: string;
}

export interface UserExistsResponse {
  userExists: boolean | undefined;
}
