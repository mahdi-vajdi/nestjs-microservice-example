import { UserCreatedIntegrationEvent } from '@app/contracts';
import { JetStreamContext } from '@app/infrastructure';
import type { JsMsg } from 'nats';

import { SseService } from '../../services/sse.service';
import { UserEventsNatsController } from './user-events.nats.controller';

describe('UserEventsNatsController', () => {
  let controller: UserEventsNatsController;
  let sseService: Pick<jest.Mocked<SseService>, 'notifyClient' | 'addClient' | 'removeClient'>;

  beforeEach(() => {
    sseService = {
      notifyClient: jest.fn(),
      addClient: jest.fn(),
      removeClient: jest.fn(),
    };

    controller = new UserEventsNatsController(sseService as SseService);
  });

  it('should process UserCreatedIntegrationEvent successfully and ack the message', async () => {
    const event = new UserCreatedIntegrationEvent(
      'event-123',
      'user-123',
      'test@example.com',
      'USER',
      new Date(),
    );

    const mockAck = jest.fn();
    const mockNak = jest.fn();

    const msg: Partial<JsMsg> = {
      ack: mockAck,
      nak: mockNak,
    };

    const context = new JetStreamContext([msg as JsMsg]);

    await controller.handleUserCreated(event, context);

    expect(sseService.notifyClient).toHaveBeenCalledWith('user-123', {
      status: 'COMPLETED',
      message: 'User account created successfully',
      user: event,
    });

    expect(mockAck).toHaveBeenCalled();
    expect(mockNak).not.toHaveBeenCalled();
  });

  it('should nak the message if processing fails', async () => {
    const event = new UserCreatedIntegrationEvent(
      'event-123',
      'user-123',
      'test@example.com',
      'USER',
      new Date(),
    );

    sseService.notifyClient.mockImplementation(() => {
      throw new Error('Test Error');
    });

    const mockAck = jest.fn();
    const mockNak = jest.fn();

    const msg: Partial<JsMsg> = {
      ack: mockAck,
      nak: mockNak,
    };

    const context = new JetStreamContext([msg as JsMsg]);

    await controller.handleUserCreated(event, context);

    expect(mockAck).not.toHaveBeenCalled();
    expect(mockNak).toHaveBeenCalledWith(1000);
  });
});
