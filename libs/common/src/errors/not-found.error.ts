import { BaseError } from '@app/common/errors/base.error';
import { ErrorCode } from '@app/common/errors/error-code.enum';

export class NotFoundError extends BaseError {
  constructor(message: string, data: Record<string, any> = null) {
    super(ErrorCode.NOT_FOUND, message, data);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
