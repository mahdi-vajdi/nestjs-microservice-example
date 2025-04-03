import { BaseError } from '@app/common/errors/base.error';
import { ErrorCode } from '@app/common/errors/error-code.enum';

export class DatabaseError extends BaseError {
  constructor(message: string, data: Record<string, any> = null) {
    super(ErrorCode.INTERNAL_ERROR, message, data);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
