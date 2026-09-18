import { UserRole } from '../../../domain';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import { UserPasswordChangedEvent } from '../../../domain/events/user-password-changed.event';
import { UserOutboxPayloadMapper } from './user-outbox-payload.mapper';

describe('UserOutboxPayloadMapper', () => {
  it('should map UserCreatedEvent to integration payload with passwordHash and occurredAt', () => {
    const event = new UserCreatedEvent(
      'user-123',
      'test@example.com',
      UserRole.CUSTOMER,
      'hashed_secret',
      'event-456',
      new Date('2026-09-18T12:00:00.000Z'),
      'corr-789',
    );

    const payload = UserOutboxPayloadMapper.toIntegrationPayload(event);

    expect(payload).toEqual({
      eventId: 'event-456',
      userId: 'user-123',
      email: 'test@example.com',
      role: UserRole.CUSTOMER,
      passwordHash: 'hashed_secret',
      occurredAt: event.occurredAt,
      correlationId: 'corr-789',
    });
    expect((payload as Record<string, unknown>).occurredOn).toBeUndefined();
  });

  it('should format UserPasswordChangedEvent with occurredAt and eventId', () => {
    const event = new UserPasswordChangedEvent(
      'user-123',
      'new_hashed_secret',
      'event-789',
      new Date('2026-09-18T12:00:00.000Z'),
      'corr-000',
    );

    const payload = UserOutboxPayloadMapper.toIntegrationPayload(event);

    expect(payload).toEqual({
      eventId: 'event-789',
      userId: 'user-123',
      newPasswordHash: 'new_hashed_secret',
      occurredAt: event.occurredAt,
      correlationId: 'corr-000',
    });
    expect((payload as Record<string, unknown>).occurredOn).toBeUndefined();
  });
});
