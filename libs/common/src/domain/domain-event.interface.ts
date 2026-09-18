export interface DomainEvent {
  eventName: string;
  eventId: string;
  aggregateId: string;
  occurredAt: Date;
  correlationId?: string;
}
