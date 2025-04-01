import { IsArray, IsMongoId } from 'class-validator';

export class UpdateChannelUserDto {
  @IsArray()
  @IsMongoId({ each: true })
  users: string[];
}
