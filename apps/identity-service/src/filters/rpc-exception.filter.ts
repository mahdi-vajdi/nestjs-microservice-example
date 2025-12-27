import {
  ConflictException,
  DomainException,
  InvalidInputException,
  NotFoundException,
  UnauthorizedException,
} from '@app/shared';
import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<Error> {
  private readonly logger = new Logger(GlobalRpcExceptionFilter.name);

  catch(exception: Error, _host: ArgumentsHost): Observable<never> {
    if (exception instanceof RpcException) {
      this.logger.warn(`RPC Exception: ${exception.message}`);
      return throwError(() => exception);
    }

    if (exception instanceof DomainException) {
      this.logger.warn(`Domain Exception: ${exception.constructor.name} - ${exception.message}`);

      return throwError(() => ({
        code: this.toRpcStatus(exception),
        message: exception.message,
      }));
    }

    this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);

    return throwError(() => ({
      code: status.INTERNAL,
      message: 'Internal server error',
    }));
  }

  private toRpcStatus(exception: DomainException): status {
    if (exception instanceof ConflictException) {
      return status.ALREADY_EXISTS;
    }
    if (exception instanceof NotFoundException) {
      return status.NOT_FOUND;
    }
    if (exception instanceof InvalidInputException) {
      return status.INVALID_ARGUMENT;
    }
    if (exception instanceof UnauthorizedException) {
      return status.UNAUTHENTICATED;
    }

    return status.INTERNAL;
  }
}
