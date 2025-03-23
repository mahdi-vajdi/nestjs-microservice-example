import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UpdateRefreshTokenRequest implements StreamMessage {
  agentId: string;
  newToken: string;

  constructor(init?: Partial<UpdateRefreshTokenRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'agent.update.refreshToken';

  }
}