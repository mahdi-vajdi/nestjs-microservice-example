export class SigninCommandRequest {
  userId: string;
  password: string;
}

export class SigninCommandResponse {
  accessToken: string;
  refreshToken: string;
}
