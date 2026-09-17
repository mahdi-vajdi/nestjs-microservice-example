import { BaseAggregateRoot } from '@app/common';

import { Email } from '../value-objects/email.value-object';

export class UserCredential extends BaseAggregateRoot {
  private _email: Email;
  private _passwordHash: string;
  private _role: string;
  private _isActive: boolean;

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

  get email(): string {
    return this._email.value;
  }

  get role(): string {
    return this._role;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
