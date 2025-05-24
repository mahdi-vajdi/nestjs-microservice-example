import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequest {
  @IsOptional()
  @IsEmail()
  @Length(5, 50)
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @ApiProperty()
  lastName?: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Length(8, 20)
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar?: string;
}

export class SignupResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
