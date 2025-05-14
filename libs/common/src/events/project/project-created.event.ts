import { EventMessage } from '@app/common/events/event.model';

export class ProjectCreatedEvent implements EventMessage {
  id: string;
  private: boolean;
  title: string;
  description: string;
  picture: string;
  createdAt: Date;
  owner: string;

  constructor(init?: Omit<ProjectCreatedEvent, 'getKey'>) {
    Object.assign(this, init);
  }

  getKey(): string {
    return 'project.project.created';
  }


}