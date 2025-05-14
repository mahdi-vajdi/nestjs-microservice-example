import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class SignupRequest {
  @IsOptional()
  @IsEmail()
  @Length(5, 50)
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  lastName?: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class SignupResponse {
  accessToken: string;
  refreshToken: string;
}
