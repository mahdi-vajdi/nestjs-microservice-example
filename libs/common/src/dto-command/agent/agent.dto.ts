import { AgentRole } from '@app/common/dto-generic';

export interface AgentDto {
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
  role: AgentRole;
  avatar: string;
  online: boolean;
}
