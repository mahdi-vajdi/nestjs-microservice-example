import { User } from '../../domain';
import { UserResponseDto } from '../dtos/user.response.dto';

export class UserResponseMapper {
  static toDto(user: User): UserResponseDto {
    return UserResponseDto.from(user);
  }
}
