import { StreamMessage } from '@app/common/nats/stream-message.model';

export class CreateAccount implements StreamMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  constructor(init?: Partial<CreateAccount>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'account.create';
  }

}