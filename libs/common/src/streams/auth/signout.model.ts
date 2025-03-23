import { StreamMessage } from '@app/common/nats/stream-message.model';

export class SignOutRequest implements StreamMessage {
  agentId: string;

  constructor(init?: Partial<SignOutRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signout';
  }
}