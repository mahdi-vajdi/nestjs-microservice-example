import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Event, EventMessage } from '@app/common/events/event.model';
import { lastValueFrom } from 'rxjs';

export abstract class NatsJetstreamService {

  abstract get client(): ClientProxy

  abstract get logger(): Logger;

  abstract get module(): string

  async emit(correlationId: string, msg: EventMessage): Promise<void> {
    try {
      const payload = new Event({
        module: this.module,
        correlationId: correlationId,
        message: msg,
      });

      this.logger.verbose(
        `adding to ${msg.getKey()} stream, payload: ${JSON.stringify(payload)}`,
      );
      return await lastValueFrom(this.client.emit<any, Event>(msg.getKey(), payload));
    } catch (error) {
      this.logger.error(`error adding to ${msg.getKey()} stream, error: ${error}`);
      throw error;
    }
  }
}