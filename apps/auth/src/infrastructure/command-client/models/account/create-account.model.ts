import { UserRole } from '@app/common/dto-generic';

export class CreateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export class CreateAccountResponse {
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
