import { AgentRole } from '@app/common/dto-generic';

export type JwtPayloadDto = {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
};
