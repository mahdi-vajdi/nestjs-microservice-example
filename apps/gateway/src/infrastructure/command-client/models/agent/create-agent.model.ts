import { AgentRole } from '@app/common/dto-generic';

export class CreateAgentRequest {
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
