import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserHttpDto {
  /**
   * The email address of the user.
   * @example 'user@example.com'
   */
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user.',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  /**
   * The password of the user.
   * @example 'password123'
   */
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (8-32 characters).',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @Length(8, 32, { message: 'Password must be at least 8 characters long.' })
  password!: string;
}
