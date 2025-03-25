import { AgentRole } from '@app/common/dto-generic';

export interface CreateAgentDto {
  accountId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  channelIds: string[];
  password: string;
  role: AgentRole;
}
