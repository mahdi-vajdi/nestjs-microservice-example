import { User } from '../entities/user.entity';

export interface EventPublisher {
  userCreated(user: User): Promise<void>;
}

export const EVENT_PUBLISHER = 'event-publisher';
