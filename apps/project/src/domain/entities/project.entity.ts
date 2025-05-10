import { AggregateRoot } from '@nestjs/cqrs';

export class Project extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private readonly _email: string,
  ) {
    super();
  }

  // Getter methods

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get email() {
    return this._email;
  }

  // entity state operations

  // Static factory method
  static create(id: string, owner: string): Project {
    const account = new Project(id, new Date(), new Date(), owner);
    // account.apply(new UserCreatedEvent(id, owner));
    return account;
  }
}
