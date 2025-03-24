export class SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export class SignupResponse {
  accessToken: string;
  refreshToken: string;
}
