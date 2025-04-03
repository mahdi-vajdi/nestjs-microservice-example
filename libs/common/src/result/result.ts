export class Result<T> {
  private constructor(status: number, message: string, data: T) {
  }

  static ok<T>(data: T, message: string = null): Result<T> {
    return new Result<T>(0, message, data);
  }

  static error<T = null>(status: number, message: string, data: T): Result<T> {
    return new Result<T>(status, message, data);
  }
}