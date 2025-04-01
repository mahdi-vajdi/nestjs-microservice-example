import { UserRole } from '@app/common/dto-generic';

export class CreateUserRequest {
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
