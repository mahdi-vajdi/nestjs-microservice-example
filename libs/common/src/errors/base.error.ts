import { ErrorCode } from './error-code.enum';

export class BaseError extends Error {
  code: ErrorCode;
  data: any;

  constructor(code: ErrorCode, message: string, data: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    Object.setPrototypeOf(this, BaseError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}