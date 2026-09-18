import { UserLoggedInEvent } from '../../../domain/events/user-logged-in.event';
import { AuthOutboxPayloadMapper } from './auth-outbox-payload.mapper';

describe('AuthOutboxPayloadMapper', () => {
  it('should format UserLoggedInEvent with eventId and occurredAt', () => {
    const event = new UserLoggedInEvent(
      'user-123',
      'event-456',
      new Date('2026-09-18T12:00:00.000Z'),
      'corr-789',
    );

    const payload = AuthOutboxPayloadMapper.build(event);

    expect(payload).toEqual({
      eventId: 'event-456',
      userId: 'user-123',
      occurredAt: event.occurredAt,
      correlationId: 'corr-789',
    });
    expect((payload as Record<string, unknown>).occurredOn).toBeUndefined();
  });
});
