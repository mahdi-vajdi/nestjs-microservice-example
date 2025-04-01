import { UserRole } from '@app/common/dto-generic/index';

export interface UserDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  account: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  refreshToken: string | null;
  role: UserRole;
  avatar: string;
  online: boolean;
}
