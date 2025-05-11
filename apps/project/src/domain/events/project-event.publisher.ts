import { Project } from '../entities/project.entity';

export interface ProjectEventPublisher {
  projectCreated(project: Project): Promise<void>;
}

export const PROJECT_EVENT_PUBLISHER = 'project-event-publisher';
