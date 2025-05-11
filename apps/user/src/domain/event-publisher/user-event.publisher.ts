import { User } from '../entities/user.entity';

export interface UserEventPublisher {
  userCreated(user: User): Promise<void>;
}

export const USER_EVENT_PUBLISHER = 'user-event-publisher';
