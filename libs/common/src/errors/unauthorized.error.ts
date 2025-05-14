import { BaseError } from '@app/common/errors/base.error';
import { ErrorCode } from '@app/common/errors/error-code.enum';

export class UnauthorizedError extends BaseError {
  constructor(message: string, data: Record<string, any> = null) {
    super(ErrorCode.UNAUTHORIZED, message, data);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
