import { StreamMessage } from '@app/common/nats/stream-message.model';

export class RefreshTokens implements StreamMessage {
  userId: string;
  refreshToken: string;

  constructor(init?: Partial<RefreshTokens>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.refreshTokens';
  }
}