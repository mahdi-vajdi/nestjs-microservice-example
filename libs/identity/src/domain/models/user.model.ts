import { randomUUID } from 'node:crypto';

import { UserCreatedEvent } from '@app/identity/domain/events/user-created.event';
import { UserRole } from '@app/identity/domain/types/user-role.enum';
import { BaseDomainEntity } from '@app/shared';
import { InvalidInputException } from '@app/shared';

export class User extends BaseDomainEntity {
  private _email: string;
  private _passwordHash: string;
  private _role: UserRole;
  private _isActive: boolean;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    passwordHash: string,
    role: UserRole,
    isActive: boolean,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
    this._passwordHash = passwordHash;
    this._role = role;
    this._isActive = isActive;
  }

  static create(email: string, passwordHash: string): User {
    const id = randomUUID();
    const now = new Date();

    const user = new User(id, now, now, email, passwordHash, UserRole.CUSTOMER, true);

    user.apply(new UserCreatedEvent(id, email, UserRole.CUSTOMER));

    return user;
  }

  static reconstitute(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    passwordHash: string,
    role: UserRole,
    isActive: boolean,
  ): User {
    return new User(id, createdAt, updatedAt, email, passwordHash, role, isActive);
  }

  public changePassword(newHash: string): void {
    if (this._passwordHash === newHash) {
      throw new InvalidInputException('The new password must be different than the old one');
    }
    this._passwordHash = newHash;
    // TODO: Create this event and its handler then publish it
    // this.apply(new UserPasswordChangedEvent(this.id))
  }

  public promoteToAdmin(): void {
    if (this._role === UserRole.ADMIN) return;
    this._role = UserRole.ADMIN;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public activate(): void {
    this._isActive = true;
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
