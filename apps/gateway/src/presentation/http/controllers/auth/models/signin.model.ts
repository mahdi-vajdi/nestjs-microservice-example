import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninRequest {
  @Length(3, 50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;
}

export class SigninResponse {
  accessToken: string;
  refreshToken: string;
}
