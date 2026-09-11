import { UserRole } from './user-role.enum';

export interface UserSnapshot {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
}
