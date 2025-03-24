import { StreamMessage } from '@app/common/nats/stream-message.model';

export class SignIn implements StreamMessage {
  email: string;
  password: string;


  constructor(init?: Partial<SignIn>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signin';
  }
}