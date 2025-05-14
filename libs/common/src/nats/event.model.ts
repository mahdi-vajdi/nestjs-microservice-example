export class Event {
  message: EventMessage;
  correlationId: string;
  module: string;
  id: string;

  constructor(init?: Partial<Event>) {
    Object.assign(this, init);
  }
}

export interface EventMessage {
  getKey(): string;
}
