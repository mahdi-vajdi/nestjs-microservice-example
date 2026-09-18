import { AggregateRoot } from '@nestjs/cqrs';

import { DomainEvent } from './domain-event.interface';

export abstract class BaseAggregateRoot extends AggregateRoot<DomainEvent> {
  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._updatedAt = updatedAt;
  }

  protected _updatedAt: Date;

  get updatedAt(): Date {
    return this._updatedAt;
  }

  equals(other: BaseAggregateRoot): boolean {
    if (!other) return false;
    return this.id === other.id;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}
