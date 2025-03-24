export class SigninRequest {
  email: string;
  password: string;
}

export class SigninResponse {
  accessToken: string;
  refreshToken: string;
}
