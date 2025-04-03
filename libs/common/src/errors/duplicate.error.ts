import { BaseError } from '@app/common/errors/base.error';
import { ErrorCode } from '@app/common/errors/error-code.enum';

export class DuplicateError extends BaseError {
  constructor(message: string, data: Record<string, any> = null) {
    super(ErrorCode.DUPLICATE, message, data);
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}