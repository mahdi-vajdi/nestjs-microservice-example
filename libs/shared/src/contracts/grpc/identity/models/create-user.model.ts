import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class CreateUserRequest {
  /**
   * The email address of the user.
   * @example 'user@example.com'
   */
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  /**
   * The password of the user.
   * @example 'password123'
   */
  @IsString()
  @Length(8, 32, { message: 'Password must be at least 8 characters long.' })
  password: string;
}

export class CreateUserResponse {
  id: string;
}
