import { StreamMessage } from '@app/common/nats/stream-message.model';

export class UpdateChannelAgents implements StreamMessage {
  requesterAccountId: string;
  channelId: string;
  agents: string[];

  constructor(init?: Partial<UpdateChannelAgents>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'channel.update.agents';
  }
}