import { StreamMessage } from '@app/common/nats/stream-message.model';

export class SignInRequest implements StreamMessage {
  email: string;
  password: string;


  constructor(init?: Partial<SignInRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signin';
  }
}