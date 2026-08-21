import { UserRole } from '../../domain';

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
