import { StreamMessage } from '@app/common/nats/stream-message.model';
import { AgentRole } from '@app/common/dto-generic';

export class CreateAgent implements StreamMessage {
  accountId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  title: string;
  channelIds: string[];
  password: string;
  role: AgentRole;

  constructor(init?: Partial<CreateAgent>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'agent.create';
  }
}