import { StreamMessage } from '@app/common/nats/stream-message.model';

export class RefreshTokensRequest implements StreamMessage {
  agentId: string;
  refreshToken: string;

  constructor(init?: Partial<RefreshTokensRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.refreshTokens';
  }
}