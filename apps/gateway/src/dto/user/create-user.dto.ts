import { UserRole } from '@app/common/dto-generic';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Length(5, 50)
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  title: string;

  @IsArray()
  @IsMongoId({ each: true })
  channelIds: string[];

  @IsStrongPassword()
  @Length(8, 20)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
