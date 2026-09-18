import { User, UserRole } from '../../domain';

export class UserResponseDto {
  id!: string;
  email!: string;
  role!: UserRole;
  isActive!: boolean;
  lastLoginAt!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.isActive = user.isActive;
    dto.lastLoginAt = user.lastLoginAt ? user.lastLoginAt.toISOString() : null;
    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();
    return dto;
  }
}
