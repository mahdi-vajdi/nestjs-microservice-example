export interface DomainEvent {
  eventId: string;
  aggregateId: string;
  occurredAt: Date;
  correlationId?: string;
}
