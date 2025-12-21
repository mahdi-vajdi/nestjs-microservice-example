import { UserRole } from '@app/identity/domain';

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
