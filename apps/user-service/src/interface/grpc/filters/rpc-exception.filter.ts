import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import {
  DomainException,
  NotFoundException,
  InvalidInputException,
  ConflictException,
} from '@app/common';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
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
    } else if (exception?.code) {
      // Pass through existing gRPC errors
      code = exception.code;
      message = exception.message || message;
    }

    return throwError(() => ({
      code,
      message,
    }));
  }
}
