import { User } from '../../entities/user.entity';

export interface ExternalEventPublisher {
  userCreated(user: User): Promise<void>;
}

export const EXTERNAL_EVENT_PUBLISHER = 'external-event-publisher';
