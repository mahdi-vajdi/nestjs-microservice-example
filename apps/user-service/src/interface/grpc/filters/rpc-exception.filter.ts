import {
  ConflictException,
  DomainException,
  InvalidInputException,
  NotFoundException,
} from '@app/common';
import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<unknown> {
  catch(exception: unknown, _host: ArgumentsHost): Observable<{ code: number; message: string }> {
    let code = status.INTERNAL;
    let message = 'Internal server error';

    if (exception instanceof NotFoundException) {
      code = status.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof InvalidInputException) {
      code = status.INVALID_ARGUMENT;
      message = exception.message;
    } else if (exception instanceof ConflictException) {
      code = status.ALREADY_EXISTS;
      message = exception.message;
      code = status.INTERNAL;
      message = 'Database error';
    } else if (exception instanceof DomainException) {
      code = status.FAILED_PRECONDITION;
      message = exception.message;
    } else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as { code: unknown }).code === 'number'
    ) {
      // Pass through existing gRPC errors
      code = (exception as { code: number }).code;
      message = (exception as { message?: string }).message || message;
    }

    return throwError(() => ({
      code,
      message,
    }));
  }
}
