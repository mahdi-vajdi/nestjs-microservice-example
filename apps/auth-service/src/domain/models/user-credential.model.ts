import * as crypto from 'node:crypto';

import { BaseAggregateRoot } from '@app/common';

import { UserLoggedInEvent } from '../events/user-logged-in.event';
import { Email } from '../value-objects/email.value-object';

export class UserCredential extends BaseAggregateRoot {
  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: Email,
    passwordHash: string,
    role: string,
    isActive: boolean,
  ) {
    super(id, createdAt, updatedAt);
    this._email = email;
    this._passwordHash = passwordHash;
    this._role = role;
    this._isActive = isActive;
  }

  private _email: Email;

  get email(): string {
    return this._email.value;
  }

  private _passwordHash: string;

  get passwordHash(): string {
    return this._passwordHash;
  }

  private _role: string;

  get role(): string {
    return this._role;
  }

  private _isActive: boolean;

  get isActive(): boolean {
    return this._isActive;
  }

  static create(
    id: string,
    email: string,
    passwordHash: string,
    role: string,
    isActive: boolean = true,
  ): UserCredential {
    const now = new Date();
    return new UserCredential(id, now, now, Email.create(email), passwordHash, role, isActive);
  }

  static reconstitute(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    passwordHash: string,
    role: string,
    isActive: boolean,
  ): UserCredential {
    return new UserCredential(
      id,
      createdAt,
      updatedAt,
      Email.create(email),
      passwordHash,
      role,
      isActive,
    );
  }

  public updatePassword(newHash: string): void {
    this._passwordHash = newHash;
  }

  public updateRole(newRole: string): void {
    this._role = newRole;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public activate(): void {
    this._isActive = true;
  }

  public login(): void {
    this.touch();
    this.apply(new UserLoggedInEvent(this.id, crypto.randomUUID(), new Date()));
  }
}
