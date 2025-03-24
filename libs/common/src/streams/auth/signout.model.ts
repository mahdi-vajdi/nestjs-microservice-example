import { StreamMessage } from '@app/common/nats/stream-message.model';

export class SignOut implements StreamMessage {
  agentId: string;

  constructor(init?: Partial<SignOut>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signout';
  }
}