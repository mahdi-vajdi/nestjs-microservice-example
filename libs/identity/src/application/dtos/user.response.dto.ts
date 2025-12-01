import { UserRole } from '@app/identity/domain/src';

export class UserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  /**
   * ISO Date
   */
  createdAt: string;
}
