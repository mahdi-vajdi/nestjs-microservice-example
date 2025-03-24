export class EventMessage<T> {
  message: T;
  correlationId: string;
  module: string;
  id: string;

  constructor(init?: Partial<EventMessage<T>>) {
    Object.assign(this, init);
  }
}
