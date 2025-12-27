export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundException extends DomainException {}
export class ConflictException extends DomainException {}
export class InvalidInputException extends DomainException {}
export class UnauthorizedException extends DomainException {}
