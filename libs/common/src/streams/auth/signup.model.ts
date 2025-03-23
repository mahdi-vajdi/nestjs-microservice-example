import { StreamMessage } from '@app/common/nats/stream-message.model';

export class SignupRequest implements StreamMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  constructor(init?: Partial<SignupRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signup';
  }
}