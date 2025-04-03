import { BaseError, ErrorCode } from '@app/common/errors';

export class Result<T> {
  private constructor(status: number, message: string, data: T) {
  }

  static ok<T>(data: T, message: string = null): Result<T> {
    return new Result<T>(0, message, data);
  }

  // Static function signatures for overloading
  static error<T = null>(error: Error): Result<T>
  static error<T = null>(error: string, status: number, data?: T): Result<T>

  static error<T = null>(error: string | Error, status: number = ErrorCode.INTERNAL_ERROR, data?: T): Result<T> {
    if (error instanceof Error) {
      if (error instanceof BaseError) {
        return new Result<T>(error.code, error.message, error.data);
      }
      return new Result<T>(ErrorCode.INTERNAL_ERROR, error.message, null);
    }

    return new Result<T>(status, error, data);
  }
}