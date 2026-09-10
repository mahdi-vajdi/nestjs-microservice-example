import { DomainEvent } from './domain-event.interface';

export abstract class BaseAggregateRoot {
  private readonly uncommittedEvents: DomainEvent[] = [];
  protected _updatedAt: Date;

  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this._updatedAt = updatedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  apply(event: DomainEvent, isFromHistory = false): void {
    if (!isFromHistory) {
      this.uncommittedEvents.push(event);
    }
  }

  getUncommittedEvents(): DomainEvent[] {
    return this.uncommittedEvents;
  }

  commit(): void {
    this.uncommittedEvents.length = 0;
  }

  equals(other: BaseAggregateRoot): boolean {
    if (!other) return false;
    return this.id === other.id;
  }
}
