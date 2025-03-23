import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UpdateChannelAgentsRequest implements StreamMessage {
  requesterAccountId: string;
  channelId: string;
  agents: string[];

  constructor(init?: Partial<UpdateChannelAgentsRequest>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'channel.update.agents';
  }
}