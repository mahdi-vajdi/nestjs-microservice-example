import { AgentRole } from '@app/common/dto-generic';

export interface JwtPayloadDto {
  sub: string;
  email: string;
  account: string;
  role: AgentRole;
}
