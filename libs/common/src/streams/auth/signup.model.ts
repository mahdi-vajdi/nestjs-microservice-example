import { StreamMessage } from '@app/common/nats/stream-message.model';

export class Signup implements StreamMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  constructor(init?: Partial<Signup>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'auth.signup';
  }
}