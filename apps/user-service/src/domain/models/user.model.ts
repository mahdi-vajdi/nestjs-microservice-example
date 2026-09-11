import { randomUUID } from 'node:crypto';

import { BaseAggregateRoot } from '@app/common';
import { InvalidInputException } from '@app/common';

import { UserActivatedEvent } from '../events/user-activated.event';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserDeactivatedEvent } from '../events/user-deactivated.event';
import { UserPasswordChangedEvent } from '../events/user-password-changed.event';
import { UserRoleChangedEvent } from '../events/user-role-changed.event';
import { UserRole } from '../types/user-role.enum';
import { UserSnapshot } from '../types/user-snapshot';
import { Email } from '../value-objects/email.value-object';

export class User extends BaseAggregateRoot {
  private _email: Email;
  private _passwordHash: string;
  private _role: UserRole;
  private _isActive: boolean;
  private _lastLoginAt: Date | null;

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: Email,
    passwordHash: string,
    role: UserRole,
    isActive: boolean,
    lastLoginAt: Date | null,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
    this._passwordHash = passwordHash;
    this._role = role;
    this._isActive = isActive;
    this._lastLoginAt = lastLoginAt;
  }

  static create(email: Email, passwordHash: string): User {
    const id = randomUUID();
    const now = new Date();

    const user = new User(id, now, now, email, passwordHash, UserRole.CUSTOMER, true, null);

    user.apply(new UserCreatedEvent(id, email.value, UserRole.CUSTOMER, randomUUID(), now));

    return user;
  }

  static reconstitute(snapshot: UserSnapshot): User {
    return new User(
      snapshot.id,
      snapshot.createdAt,
      snapshot.updatedAt,
      Email.create(snapshot.email),
      snapshot.passwordHash,
      snapshot.role,
      snapshot.isActive,
      snapshot.lastLoginAt,
    );
  }

  public changePassword(newHash: string): void {
    if (this._passwordHash === newHash) {
      throw new InvalidInputException('The new password must be different than the old one');
    }
    this._passwordHash = newHash;
    this.touch();
    this.apply(new UserPasswordChangedEvent(this.id, randomUUID(), new Date()));
  }

  public changeRole(role: UserRole): void {
    if (this._role === role) return;
    this._role = role;
    this.touch();
    this.apply(new UserRoleChangedEvent(this.id, role, randomUUID(), new Date()));
  }

  public promoteToAdmin(): void {
    this.changeRole(UserRole.ADMIN);
  }

  public deactivate(): void {
    if (!this._isActive) return;
    this._isActive = false;
    this.touch();
    this.apply(new UserDeactivatedEvent(this.id, randomUUID(), new Date()));
  }

  public activate(): void {
    if (this._isActive) return;
    this._isActive = true;
    this.touch();
    this.apply(new UserActivatedEvent(this.id, randomUUID(), new Date()));
  }

  public recordLastLogin(): void {
    this._lastLoginAt = new Date();
    this.touch();
  }

  get email(): string {
    return this._email.value;
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

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }
}
