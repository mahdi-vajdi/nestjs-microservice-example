import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UpdateRefreshToken implements StreamMessage {
  agentId: string;
  newToken: string;

  constructor(init?: Partial<UpdateRefreshToken>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'agent.update.refreshToken';

  }
}