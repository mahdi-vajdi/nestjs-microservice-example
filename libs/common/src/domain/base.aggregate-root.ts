export abstract class BaseAggregateRoot {
  private readonly uncommittedEvents: any[] = [];

  protected constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  apply(event: any, isFromHistory = false): void {
    if (!isFromHistory) {
      this.uncommittedEvents.push(event);
    }
  }

  getUncommittedEvents(): any[] {
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
