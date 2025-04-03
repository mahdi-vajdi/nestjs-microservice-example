import { BaseError } from '@app/common/errors/base.error';
import { ErrorCode } from '@app/common/errors/error-code.enum';

export class ForbiddenAccessError extends BaseError {
  constructor(message: string, data: Record<string, any> = null) {
    super(ErrorCode.FORBIDDEN, message, data);
    Object.setPrototypeOf(this, ForbiddenAccessError.prototype);
  }
}
