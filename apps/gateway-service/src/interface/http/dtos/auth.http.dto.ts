import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginHttpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LogoutHttpDto {
  @ApiProperty({ example: 'eyJh...', description: 'Refresh token to invalidate' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class RefreshTokenHttpDto {
  @ApiProperty({ example: 'eyJh...', description: 'Refresh token to get a new access token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
