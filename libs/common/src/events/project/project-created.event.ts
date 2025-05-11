import { StreamMessage } from '@app/common/nats/stream-message.model';

export class ProjectCreatedEvent implements StreamMessage {
  id: string;
  private: boolean;
  title: string;
  description: string;
  picture: string;
  createdAt: Date;
  owner: string;

  constructor(init?: Omit<ProjectCreatedEvent, 'streamKey'>) {
    Object.assign(this, init);
  }

  streamKey(): string {
    return 'project.project.created';
  }


}