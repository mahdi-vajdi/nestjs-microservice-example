import { AggregateRoot } from '@nestjs/cqrs';

export abstract class BaseDomainEntity extends AggregateRoot {
  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    super();
  }

  equals(other: BaseDomainEntity): boolean {
    if (!other || !(other instanceof BaseDomainEntity)) return false;
    return this.id === other.id;
  }
}
