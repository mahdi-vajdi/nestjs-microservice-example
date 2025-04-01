import { UserRole } from '@app/common/dto-generic';

export interface CreateUserDto {
  accountId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  channelIds: string[];
  password: string;
  role: UserRole;
}
